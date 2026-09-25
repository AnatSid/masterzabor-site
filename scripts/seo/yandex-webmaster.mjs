import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const ENV_PATH = join(ROOT, ".env.yandex-webmaster.local");
const OUTPUT_DIR = join(ROOT, ".tmp", "seo");
const API_BASE = "https://api.webmaster.yandex.net/v4";
const SITEMAP_URL = "https://www.masterzabor.by/sitemap.xml";
const CANONICAL_ORIGIN = "https://www.masterzabor.by";
const MAX_ATTEMPTS = 3;
const MAX_SAMPLE_ITEMS = 50_000;
const MAX_SITEMAPS = 1_000;
const EXPECTED_SNAPSHOT_SECTIONS = 19;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

class WebmasterError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "WebmasterError";
    this.code = code;
  }
}

function safeError(error) {
  if (error instanceof WebmasterError) {
    return { code: error.code, message: error.message };
  }
  return { code: "UNEXPECTED_ERROR", message: "Unexpected local error" };
}

function safeApiCode(value, status) {
  return typeof value === "string" && /^[A-Z][A-Z0-9_]{1,79}$/.test(value)
    ? value
    : "HTTP_" + status;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, label) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response;
    try {
      response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      if (attempt === MAX_ATTEMPTS) {
        throw new WebmasterError("NETWORK_ERROR", label + ": network request failed");
      }
      await wait(1_000 * 2 ** (attempt - 1));
      continue;
    }

    if (response.ok) return response;

    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    const code = safeApiCode(payload?.error_code ?? payload?.code, response.status);
    const retryable =
      RETRYABLE_STATUSES.has(response.status) && code !== "QUOTA_EXCEEDED";
    if (retryable && attempt < MAX_ATTEMPTS) {
      await wait(1_000 * 2 ** (attempt - 1));
      continue;
    }
    throw new WebmasterError(
      code,
      label + ": HTTP " + response.status + " (" + code + ")",
    );
  }
  throw new WebmasterError("RETRY_LIMIT", label + ": retry limit reached");
}

function normalizeHostUrl(value) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      (url.pathname !== "/" && url.pathname !== "") ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.origin + "/";
  } catch {
    return null;
  }
}

async function readConfig() {
  let contents;
  try {
    contents = await readFile(ENV_PATH, "utf8");
  } catch {
    throw new WebmasterError(
      "MISSING_LOCAL_ENV",
      "Missing .env.yandex-webmaster.local; see the runbook after review",
    );
  }
  let env;
  try {
    env = parseEnv(contents);
  } catch {
    throw new WebmasterError("INVALID_LOCAL_ENV", "Invalid local env syntax");
  }
  const token = env.YANDEX_WEBMASTER_TOKEN?.trim();
  const hostUrl = normalizeHostUrl(env.YANDEX_WEBMASTER_HOST_URL?.trim() ?? "");
  if (!token || /^(replace_|your_|<)/i.test(token)) {
    throw new WebmasterError(
      "MISSING_WEBMASTER_TOKEN",
      "YANDEX_WEBMASTER_TOKEN is missing or a placeholder",
    );
  }
  if (hostUrl !== CANONICAL_ORIGIN + "/") {
    throw new WebmasterError(
      "INVALID_HOST_URL",
      "YANDEX_WEBMASTER_HOST_URL must be https://www.masterzabor.by/",
    );
  }
  return { token, hostUrl };
}

// This map is the full API allowlist. The only POST retrieves filtered analytics.
const ENDPOINTS = {
  user: { method: "GET", path: () => "/user" },
  hosts: { method: "GET", path: ({ user }) => "/user/" + user + "/hosts" },
  hostInfo: { method: "GET", path: ({ base }) => base },
  summary: { method: "GET", path: ({ base }) => base + "/summary" },
  diagnostics: { method: "GET", path: ({ base }) => base + "/diagnostics" },
  indexingHistory: { method: "GET", path: ({ base }) => base + "/indexing/history" },
  indexingSamples: { method: "GET", path: ({ base }) => base + "/indexing/samples" },
  inSearchHistory: {
    method: "GET",
    path: ({ base }) => base + "/search-urls/in-search/history",
  },
  inSearchSamples: {
    method: "GET",
    path: ({ base }) => base + "/search-urls/in-search/samples",
  },
  eventHistory: {
    method: "GET",
    path: ({ base }) => base + "/search-urls/events/history",
  },
  eventSamples: {
    method: "GET",
    path: ({ base }) => base + "/search-urls/events/samples",
  },
  detectedSitemaps: { method: "GET", path: ({ base }) => base + "/sitemaps" },
  detectedSitemap: {
    method: "GET",
    path: ({ base, sitemap }) => base + "/sitemaps/" + sitemap,
  },
  userAddedSitemaps: {
    method: "GET",
    path: ({ base }) => base + "/user-added-sitemaps",
  },
  userAddedSitemap: {
    method: "GET",
    path: ({ base, sitemap }) => base + "/user-added-sitemaps/" + sitemap,
  },
  searchHistory: {
    method: "GET",
    path: ({ base }) => base + "/search-queries/all/history",
  },
  popularQueries: {
    method: "GET",
    path: ({ base }) => base + "/search-queries/popular",
  },
  queryAnalytics: {
    method: "POST",
    path: ({ base }) => base + "/query-analytics/list",
  },
  externalSamples: {
    method: "GET",
    path: ({ base }) => base + "/links/external/samples",
  },
  externalHistory: {
    method: "GET",
    path: ({ base }) => base + "/links/external/history",
  },
};

async function apiJson(context, name, query, body, sitemapId) {
  const endpoint = ENDPOINTS[name];
  if (!endpoint) {
    throw new WebmasterError("ENDPOINT_NOT_ALLOWED", "API endpoint is not allowed");
  }
  if ((body !== undefined) !== (endpoint.method === "POST")) {
    throw new WebmasterError("METHOD_NOT_ALLOWED", "API method is not allowed");
  }
  const user = context.userId === undefined ? undefined : String(context.userId);
  if (user !== undefined && !/^[0-9]+$/.test(user)) {
    throw new WebmasterError("INVALID_USER_ID", "Invalid API user ID");
  }
  const base =
    user && context.hostId
      ? "/user/" + user + "/hosts/" + encodeURIComponent(context.hostId)
      : undefined;
  if (name !== "user" && !user) {
    throw new WebmasterError("MISSING_USER_ID", "API user ID is missing");
  }
  if (name !== "user" && name !== "hosts" && !base) {
    throw new WebmasterError("MISSING_HOST_ID", "API host ID is missing");
  }
  const sitemap = sitemapId === undefined ? undefined : encodeURIComponent(sitemapId);
  if ((name === "detectedSitemap" || name === "userAddedSitemap") && !sitemap) {
    throw new WebmasterError("MISSING_SITEMAP_ID", "API sitemap ID is missing");
  }
  const url = new URL(API_BASE + endpoint.path({ user, base, sitemap }));
  if (query) {
    for (const [key, value] of query) url.searchParams.append(key, value);
  }
  const response = await fetchWithRetry(
    url,
    {
      method: endpoint.method,
      headers: {
        Authorization: "OAuth " + context.token,
        Accept: "application/json",
        ...(body === undefined
          ? {}
          : { "Content-Type": "application/json; charset=UTF-8" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    },
    name,
  );
  try {
    return await response.json();
  } catch {
    throw new WebmasterError("INVALID_JSON", name + ": invalid JSON response");
  }
}

async function getContext(config) {
  const context = { token: config.token };
  const user = await apiJson(context, "user");
  if (!/^[0-9]+$/.test(String(user?.user_id))) {
    throw new WebmasterError("INVALID_USER_RESPONSE", "User ID is missing");
  }
  context.userId = user.user_id;
  const hosts = await apiJson(context, "hosts");
  if (!Array.isArray(hosts?.hosts)) {
    throw new WebmasterError("INVALID_HOSTS_RESPONSE", "Host list is missing");
  }
  const matches = hosts.hosts.filter(
    (host) =>
      normalizeHostUrl(host.ascii_host_url) === config.hostUrl ||
      normalizeHostUrl(host.unicode_host_url) === config.hostUrl,
  );
  if (matches.length !== 1 || typeof matches[0]?.host_id !== "string") {
    throw new WebmasterError(
      "HOST_NOT_UNIQUE_OR_MISSING",
      "Exact Webmaster host is not available in the account",
    );
  }
  context.hostId = matches[0].host_id;
  const hostInfo = await apiJson(context, "hostInfo");
  if (hostInfo?.host_id !== context.hostId) {
    throw new WebmasterError("HOST_ID_MISMATCH", "Host response ID does not match");
  }
  if (hostInfo.verified !== true) {
    throw new WebmasterError("HOST_NOT_VERIFIED", "Selected host is not verified");
  }
  if (hostInfo.host_data_status !== "OK") {
    throw new WebmasterError(
      "HOST_DATA_NOT_READY",
      "Selected host data status: " +
        (typeof hostInfo.host_data_status === "string"
          ? hostInfo.host_data_status
          : "unknown"),
    );
  }
  return { context, hostInfo, hostCount: hosts.hosts.length };
}

function queryParams(entries) {
  return new URLSearchParams(entries);
}

function analyticsBody(mode, offset, limit) {
  return {
    offset,
    limit,
    device_type_indicator: "ALL",
    search_location: "WEB_LOCATION",
    text_indicator: mode,
  };
}

async function listSitemaps(context, name) {
  const items = [];
  const seen = new Set();
  let cursor;
  while (items.length < MAX_SITEMAPS) {
    const query = queryParams([["limit", "100"]]);
    if (cursor) query.append(name === "detectedSitemaps" ? "from" : "offset", cursor);
    let data;
    try {
      data = await apiJson(context, name, query);
    } catch (error) {
      return { items, complete: false, error: safeError(error) };
    }
    if (!Array.isArray(data?.sitemaps)) {
      return {
        items,
        complete: false,
        error: { code: "INVALID_LIST_RESPONSE", message: name + ": sitemap list missing" },
      };
    }
    const page = data.sitemaps;
    if (page.length === 0) return { items, complete: true };
    for (const item of page) {
      if (typeof item?.sitemap_id !== "string" || seen.has(item.sitemap_id)) {
        return {
          items,
          complete: false,
          error: { code: "INVALID_PAGINATION", message: name + ": invalid sitemap cursor" },
        };
      }
      seen.add(item.sitemap_id);
      items.push(item);
    }
    cursor = page.at(-1).sitemap_id;
    if (page.length < 100 || (Number.isFinite(Number(data.count)) && items.length >= Number(data.count))) {
      return { items, complete: true };
    }
  }
  return { items, complete: false, truncated: true };
}

async function paginate(context, name, field, pageSize, maxItems, baseQuery, bodyMode) {
  const items = [];
  let count;
  let dateFrom;
  let dateTo;
  while (items.length < maxItems) {
    const limit = Math.min(pageSize, maxItems - items.length);
    const offset = items.length;
    let data;
    try {
      if (bodyMode) {
        data = await apiJson(context, name, undefined, analyticsBody(bodyMode, offset, limit));
      } else {
        const query = new URLSearchParams(baseQuery);
        query.set("offset", String(offset));
        query.set("limit", String(limit));
        data = await apiJson(context, name, query);
      }
    } catch (error) {
      return { items, count, dateFrom, dateTo, complete: false, error: safeError(error) };
    }
    if (!Array.isArray(data?.[field])) {
      return {
        items,
        count,
        dateFrom,
        dateTo,
        complete: false,
        error: { code: "INVALID_LIST_RESPONSE", message: name + ": result list missing" },
      };
    }
    if (Number.isFinite(Number(data.count))) count = Number(data.count);
    if (typeof data.date_from === "string") dateFrom = data.date_from;
    if (typeof data.date_to === "string") dateTo = data.date_to;
    items.push(...data[field]);
    if (items.length >= maxItems) {
      return { items, count, dateFrom, dateTo, complete: false, truncated: true };
    }
    if (data[field].length < limit && count !== undefined && items.length < count) {
      return {
        items,
        count,
        dateFrom,
        dateTo,
        complete: false,
        error: { code: "INCOMPLETE_PAGE", message: name + ": API returned a short page" },
      };
    }
    if (data[field].length < limit || (count !== undefined && items.length >= count)) {
      return { items, count, dateFrom, dateTo, complete: true };
    }
  }
  return { items, count, dateFrom, dateTo, complete: false, truncated: true };
}

function decodeXml(text) {
  return text.replace(/&(#(?:x[0-9a-f]+|[0-9]+)|amp|lt|gt|quot|apos);/gi, (match, entity) => {
    if (entity.startsWith("#")) {
      const hex = entity[1]?.toLowerCase() === "x";
      const number = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isInteger(number) && number >= 0 && number <= 0x10ffff
        ? String.fromCodePoint(number)
        : match;
    }
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[entity.toLowerCase()];
  });
}

async function readCanonicalSitemap() {
  const response = await fetchWithRetry(SITEMAP_URL, {}, "Canonical sitemap");
  if (new URL(response.url).origin !== CANONICAL_ORIGIN) {
    throw new WebmasterError("SITEMAP_REDIRECTED", "Sitemap left canonical origin");
  }
  const xml = await response.text();
  if (!/<urlset(?:\s|>)/i.test(xml) || /<sitemapindex(?:\s|>)/i.test(xml)) {
    throw new WebmasterError("INVALID_SITEMAP", "Expected a URL sitemap");
  }
  const urls = [];
  const seen = new Set();
  for (const block of xml.matchAll(/<url(?:\s[^>]*)?>([\s\S]*?)<\/url>/gi)) {
    const match = block[1].match(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc>/i);
    if (!match) throw new WebmasterError("INVALID_SITEMAP", "Sitemap URL has no loc");
    const value = decodeXml(match[1].trim());
    let url;
    try {
      url = new URL(value);
    } catch {
      throw new WebmasterError("INVALID_SITEMAP_URL", "Sitemap contains an invalid URL");
    }
    if (
      url.origin !== CANONICAL_ORIGIN ||
      url.search ||
      url.hash ||
      (url.pathname !== "/" && url.pathname.endsWith("/"))
    ) {
      throw new WebmasterError("NON_CANONICAL_SITEMAP_URL", "Non-canonical sitemap URL");
    }
    if (!seen.has(value)) {
      seen.add(value);
      urls.push(value);
    }
  }
  if (urls.length === 0) {
    throw new WebmasterError("EMPTY_SITEMAP", "Sitemap contains no canonical URLs");
  }
  return { sourceUrl: SITEMAP_URL, canonicalUrls: urls, count: urls.length };
}

function dateRange(days) {
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return {
    dateFrom: start.toISOString().slice(0, 10),
    dateTo: end.toISOString().slice(0, 10),
  };
}

function historyQuery(range) {
  return queryParams([
    ["date_from", range.dateFrom],
    ["date_to", range.dateTo],
  ]);
}

async function doctor() {
  const config = await readConfig();
  console.log("Local env: PASS (values hidden)");
  const { context, hostInfo, hostCount } = await getContext(config);
  console.log("OAuth and user/hosts/host info: PASS");
  console.log("Hosts visible: " + hostCount);
  console.log("Selected host: " + config.hostUrl + " [" + context.hostId + "]");
  console.log("Verified: " + hostInfo.verified);
  console.log("Host data status: " + hostInfo.host_data_status);

  const failures = [];
  async function probe(label, operation) {
    try {
      await operation();
      console.log(label + ": PASS");
    } catch (error) {
      const safe = safeError(error);
      failures.push(safe);
      console.log(label + ": FAIL " + safe.code);
    }
  }
  let detectedMatch;
  await probe("Detected sitemap read", async () => {
    const detected = await listSitemaps(context, "detectedSitemaps");
    if (!detected.complete) {
      throw new WebmasterError(
        detected.error?.code ?? "SITEMAP_LIST_INCOMPLETE",
        "Detected sitemap read failed or was incomplete",
      );
    }
    detectedMatch = detected.items.find((item) => item.sitemap_url === SITEMAP_URL);
    console.log("Detected sitemap: " + (detectedMatch ? "FOUND" : "NOT FOUND"));
    if (!detectedMatch) {
      throw new WebmasterError("SITEMAP_NOT_DETECTED", "Canonical sitemap is not detected");
    }
  });
  await probe("User-added sitemap read", async () => {
    const userAdded = await listSitemaps(context, "userAddedSitemaps");
    if (!userAdded.complete) {
      throw new WebmasterError(
        userAdded.error?.code ?? "SITEMAP_LIST_INCOMPLETE",
        "User-added sitemap read failed or was incomplete",
      );
    }
    const submittedMatch = userAdded.items.find((item) => item.sitemap_url === SITEMAP_URL);
    console.log("User-added sitemap: " + (submittedMatch ? "FOUND" : "NOT FOUND"));
  });
  if (detectedMatch) {
    await probe("Sitemap detail read", () =>
      apiJson(context, "detectedSitemap", undefined, undefined, detectedMatch.sitemap_id),
    );
  }
  await probe("External links scope", async () => {
    const data = await apiJson(context, "externalSamples", queryParams([["limit", "1"]]));
    if (!Array.isArray(data?.links)) {
      throw new WebmasterError("INVALID_LIST_RESPONSE", "External links list missing");
    }
  });
  await probe("Query analytics scope", async () => {
    const data = await apiJson(context, "queryAnalytics", undefined, analyticsBody("QUERY", 0, 1));
    if (!Array.isArray(data?.text_indicator_to_statistics)) {
      throw new WebmasterError("INVALID_LIST_RESPONSE", "Query analytics list missing");
    }
  });
  if (failures.length > 0) {
    throw new WebmasterError(
      failures[0].code,
      failures.length + " required read-only check(s) failed",
    );
  }
  console.log("PASS");
}

async function snapshot() {
  const config = await readConfig();
  const { context, hostInfo } = await getContext(config);
  const capturedAt = new Date().toISOString();
  const range = dateRange(28);
  const results = {};
  async function capture(name, operation) {
    try {
      const data = await operation();
      const status = data?.error || data?.truncated || data?.complete === false
        ? "partial"
        : "ok";
      results[name] = { status, data };
    } catch (error) {
      results[name] = { status: "error", error: safeError(error) };
    }
    console.log(name + ": " + results[name].status.toUpperCase());
  }

  await capture("publicSitemap", readCanonicalSitemap);
  await capture("summary", () => apiJson(context, "summary"));
  await capture("diagnostics", () => apiJson(context, "diagnostics"));
  await capture("indexingHistory", () =>
    apiJson(context, "indexingHistory", historyQuery(range)),
  );
  await capture("indexingSamples", () =>
    paginate(context, "indexingSamples", "samples", 100, MAX_SAMPLE_ITEMS),
  );
  await capture("inSearchHistory", () =>
    apiJson(context, "inSearchHistory", historyQuery(range)),
  );
  await capture("inSearchSamples", () =>
    paginate(context, "inSearchSamples", "samples", 100, MAX_SAMPLE_ITEMS),
  );
  await capture("eventHistory", () =>
    apiJson(context, "eventHistory", historyQuery(range)),
  );
  await capture("eventSamples", () =>
    paginate(context, "eventSamples", "samples", 100, MAX_SAMPLE_ITEMS),
  );
  await capture("detectedSitemaps", () => listSitemaps(context, "detectedSitemaps"));
  await capture("userAddedSitemaps", () => listSitemaps(context, "userAddedSitemaps"));

  const detected = results.detectedSitemaps?.data?.items?.find(
    (item) => item.sitemap_url === SITEMAP_URL,
  );
  const userAdded = results.userAddedSitemaps?.data?.items?.find(
    (item) => item.sitemap_url === SITEMAP_URL,
  );
  await capture("detectedSitemapDetail", () => {
    if (results.detectedSitemaps.status !== "ok") {
      throw new WebmasterError("SOURCE_LIST_INCOMPLETE", "Detected sitemap list incomplete");
    }
    if (!detected) {
      throw new WebmasterError("SITEMAP_NOT_DETECTED", "Canonical sitemap is not detected");
    }
    return apiJson(context, "detectedSitemap", undefined, undefined, detected.sitemap_id);
  });
  await capture("userAddedSitemapDetail", () => {
    if (results.userAddedSitemaps.status !== "ok") {
      throw new WebmasterError("SOURCE_LIST_INCOMPLETE", "User-added sitemap list incomplete");
    }
    return userAdded
      ? apiJson(context, "userAddedSitemap", undefined, undefined, userAdded.sitemap_id)
      : { matched: false, reason: "SITEMAP_NOT_USER_ADDED" };
  });

  const indicators = queryParams([
    ["query_indicator", "TOTAL_SHOWS"],
    ["query_indicator", "TOTAL_CLICKS"],
    ["query_indicator", "AVG_SHOW_POSITION"],
    ["query_indicator", "AVG_CLICK_POSITION"],
  ]);
  await capture("searchHistory", () => apiJson(context, "searchHistory", indicators));
  const popularQuery = new URLSearchParams(indicators);
  popularQuery.set("order_by", "TOTAL_SHOWS");
  await capture("popularQueries", () =>
    paginate(context, "popularQueries", "queries", 500, 3_000, popularQuery),
  );
  await capture("queryAnalyticsQuery", () =>
    paginate(
      context,
      "queryAnalytics",
      "text_indicator_to_statistics",
      500,
      MAX_SAMPLE_ITEMS,
      undefined,
      "QUERY",
    ),
  );
  await capture("queryAnalyticsUrl", () =>
    paginate(
      context,
      "queryAnalytics",
      "text_indicator_to_statistics",
      500,
      MAX_SAMPLE_ITEMS,
      undefined,
      "URL",
    ),
  );
  await capture("externalSamples", () =>
    paginate(context, "externalSamples", "links", 100, MAX_SAMPLE_ITEMS),
  );
  await capture("externalHistory", () =>
    apiJson(
      context,
      "externalHistory",
      queryParams([["indicator", "LINKS_TOTAL_COUNT"]]),
    ),
  );

  const canonicalUrls = results.publicSitemap?.data?.canonicalUrls;
  const searchSamples = results.inSearchSamples?.data;
  const searchSampleComplete =
    results.inSearchSamples?.status === "ok" && searchSamples?.complete === true;
  const observed = new Set(searchSamples?.items?.map((item) => item.url) ?? []);
  const comparison = Array.isArray(canonicalUrls)
    ? canonicalUrls.map((url) => ({
        url,
        status: observed.has(url)
          ? "observedInSearchSample"
          : searchSampleComplete
            ? "notObservedInSample"
            : "comparisonUnavailable",
      }))
    : [];
  const attempted = Object.keys(results).length;
  const succeeded = Object.values(results).filter((item) => item.status === "ok").length;
  const failed = attempted - succeeded;
  const snapshotData = {
    schemaVersion: 1,
    capturedAt,
    hostId: context.hostId,
    hostUrl: config.hostUrl,
    sourceSitemapUrl: SITEMAP_URL,
    host: hostInfo,
    requestedPeriods: {
      indexingAndSearchUrlHistory: range,
      searchQueryHistory: "API default: last week",
      popularQueries: "API default: last week; actual dates in response",
      queryAnalytics: "API last two weeks",
    },
    data: results,
    canonicalComparison: {
      sourceCount: canonicalUrls?.length ?? null,
      pagesInSearchSampleComplete: searchSampleComplete,
      note:
        "Absence from the Yandex sample is not proof of permanent exclusion or a URL Inspection verdict.",
      urls: comparison,
    },
    summary: {
      canonicalUrls: canonicalUrls?.length ?? null,
      attempted,
      succeeded,
      failed,
      complete: attempted === EXPECTED_SNAPSHOT_SECTIONS,
      dataComplete: failed === 0 && searchSampleComplete && Array.isArray(canonicalUrls),
    },
  };
  await mkdir(OUTPUT_DIR, { recursive: true });
  const stamp = capturedAt.replace(/[:.]/g, "-");
  const path = join(OUTPUT_DIR, "yandex-webmaster-snapshot-" + stamp + ".json");
  const temporaryPath = path + ".tmp";
  await writeFile(temporaryPath, JSON.stringify(snapshotData, null, 2) + "\n", {
    flag: "wx",
  });
  await rename(temporaryPath, path);
  console.log("Snapshot: " + path);
  console.log(
    "Sections: attempted=" + attempted + " succeeded=" + succeeded +
      " failed=" + failed + " complete=" + snapshotData.summary.complete +
      " dataComplete=" + snapshotData.summary.dataComplete,
  );
}

async function main() {
  try {
    if (process.argv[2] === "doctor") {
      await doctor();
    } else if (process.argv[2] === "snapshot") {
      await snapshot();
    } else {
      throw new WebmasterError(
        "INVALID_COMMAND",
        "Use npm run seo:yandex-webmaster:doctor or npm run seo:yandex-webmaster:snapshot",
      );
    }
  } catch (error) {
    const safe = safeError(error);
    console.error("FAIL " + safe.code + ": " + safe.message);
    process.exitCode = 1;
  }
}

await main();

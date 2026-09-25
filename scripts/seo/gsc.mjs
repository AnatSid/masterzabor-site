import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const ENV_PATH = join(ROOT, ".env.gsc.local");
const OUTPUT_DIR = join(ROOT, ".tmp", "seo");
const DEFAULT_SITE_URL = "sc-domain:masterzabor.by";
const SITEMAP_URL = "https://www.masterzabor.by/sitemap.xml";
const CANONICAL_ORIGIN = "https://www.masterzabor.by";
const SEARCH_CONSOLE_BASE = "https://www.googleapis.com/webmasters/v3";
const INSPECTION_URL =
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const SEARCH_ANALYTICS_ROW_LIMIT = 25_000;
const MAX_ATTEMPTS = 4;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const RETRYABLE_REASONS = new Set([
  "rateLimitExceeded",
  "userRateLimitExceeded",
  "quotaExceeded",
  "RESOURCE_EXHAUSTED",
]);

class GscError extends Error {
  constructor(message, code = "GSC_ERROR") {
    super(message);
    this.name = "GscError";
    this.code = code;
  }
}

function safeError(error) {
  if (error instanceof GscError) {
    return { code: error.code, message: error.message };
  }
  return { code: "UNEXPECTED_ERROR", message: "Unexpected local error" };
}

function safeReason(value) {
  return typeof value === "string" && /^[A-Za-z0-9_.-]{1,80}$/.test(value)
    ? value
    : undefined;
}

async function googleErrorReason(response) {
  try {
    const payload = await response.json();
    const error = payload?.error;
    return (
      safeReason(error?.errors?.[0]?.reason) ??
      safeReason(error?.status) ??
      safeReason(error)
    );
  } catch {
    return undefined;
  }
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
        throw new GscError(`${label}: network request failed`, "NETWORK_ERROR");
      }
      await wait(1_000 * 2 ** (attempt - 1));
      continue;
    }

    if (response.ok) return response;

    const reason = await googleErrorReason(response);
    const retryable =
      RETRYABLE_STATUSES.has(response.status) ||
      (response.status === 403 && RETRYABLE_REASONS.has(reason));

    if (retryable && attempt < MAX_ATTEMPTS) {
      await wait(1_000 * 2 ** (attempt - 1));
      continue;
    }

    throw new GscError(
      `${label}: HTTP ${response.status}${reason ? ` (${reason})` : ""}`,
      reason ?? `HTTP_${response.status}`,
    );
  }

  throw new GscError(`${label}: retry limit reached`, "RETRY_LIMIT");
}

async function readConfig() {
  let text;
  try {
    text = await readFile(ENV_PATH, "utf8");
  } catch {
    throw new GscError(
      "Missing .env.gsc.local. OAuth setup is not approved yet; see the runbook.",
      "MISSING_LOCAL_ENV",
    );
  }

  let env;
  try {
    env = parseEnv(text);
  } catch {
    throw new GscError("Invalid .env.gsc.local syntax", "INVALID_LOCAL_ENV");
  }

  const required = ["GSC_CLIENT_ID", "GSC_CLIENT_SECRET", "GSC_REFRESH_TOKEN"];
  const missing = required.filter((name) => {
    const value = env[name]?.trim();
    return !value || /^(replace_|your_|<)/i.test(value);
  });
  if (missing.length > 0) {
    throw new GscError(
      `Missing or placeholder GSC settings: ${missing.join(", ")}`,
      "MISSING_GSC_CONFIG",
    );
  }

  const siteUrl = env.GSC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  if (
    siteUrl !== DEFAULT_SITE_URL &&
    siteUrl !== `${CANONICAL_ORIGIN}/`
  ) {
    throw new GscError(
      "GSC_SITE_URL must be sc-domain:masterzabor.by or https://www.masterzabor.by/",
      "INVALID_SITE_URL",
    );
  }

  return {
    clientId: env.GSC_CLIENT_ID.trim(),
    clientSecret: env.GSC_CLIENT_SECRET.trim(),
    refreshToken: env.GSC_REFRESH_TOKEN.trim(),
    siteUrl,
  };
}

async function getAccessToken(config) {
  const response = await fetchWithRetry(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        grant_type: "refresh_token",
      }),
    },
    "OAuth refresh",
  );

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new GscError("OAuth refresh: invalid JSON response", "INVALID_JSON");
  }
  if (typeof payload?.access_token !== "string" || !payload.access_token) {
    throw new GscError("OAuth refresh: access token missing", "MISSING_ACCESS_TOKEN");
  }
  return payload.access_token;
}

async function apiJson(url, accessToken, method = "GET", body) {
  const response = await fetchWithRetry(
    url,
    {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
    "Search Console API",
  );
  try {
    return await response.json();
  } catch {
    throw new GscError("Search Console API: invalid JSON response", "INVALID_JSON");
  }
}

function propertyPath(siteUrl) {
  return `${SEARCH_CONSOLE_BASE}/sites/${encodeURIComponent(siteUrl)}`;
}

async function verifyProperty(accessToken, siteUrl) {
  const response = await apiJson(`${SEARCH_CONSOLE_BASE}/sites`, accessToken);
  const entries = response.siteEntry ?? [];
  if (!Array.isArray(entries)) {
    throw new GscError("sites.list returned no property list", "INVALID_SITES_LIST");
  }
  const sites = entries
    .filter((entry) => typeof entry.siteUrl === "string")
    .map((entry) => ({
      siteUrl: entry.siteUrl,
      permissionLevel: entry.permissionLevel ?? "unknown",
    }));
  const selected = sites.find((entry) => entry.siteUrl === siteUrl);
  if (!selected || selected.permissionLevel === "siteUnverifiedUser") {
    return { sites, selected: null };
  }
  return { sites, selected };
}

async function getSubmittedSitemap(accessToken, siteUrl) {
  const response = await apiJson(`${propertyPath(siteUrl)}/sitemaps`, accessToken);
  const sitemaps = response.sitemap ?? [];
  if (!Array.isArray(sitemaps)) {
    throw new GscError("sitemaps.list returned invalid data", "INVALID_SITEMAPS_LIST");
  }
  const item = sitemaps.find((entry) => entry.path === SITEMAP_URL);
  if (!item) return { submitted: false, path: SITEMAP_URL };

  return {
    submitted: true,
    path: item.path,
    isPending: item.isPending ?? null,
    lastSubmitted: item.lastSubmitted ?? null,
    lastDownloaded: item.lastDownloaded ?? null,
    warnings: item.warnings ?? null,
    errors: item.errors ?? null,
    contents: Array.isArray(item.contents)
      ? item.contents.map((content) => ({
          type: content.type ?? null,
          submitted: content.submitted ?? null,
        }))
      : [],
  };
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
    return {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
    }[entity.toLowerCase()];
  });
}

async function getCanonicalUrls() {
  const response = await fetchWithRetry(SITEMAP_URL, {}, "Canonical sitemap");
  const xml = await response.text();
  if (!/<urlset(?:\s|>)/i.test(xml) || /<sitemapindex(?:\s|>)/i.test(xml)) {
    throw new GscError("Expected a URL sitemap at /sitemap.xml", "INVALID_SITEMAP");
  }

  const urls = [];
  const seen = new Set();
  const blocks = [...xml.matchAll(/<url(?:\s[^>]*)?>([\s\S]*?)<\/url>/gi)];
  for (const block of blocks) {
    const match = block[1].match(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc>/i);
    if (!match) {
      throw new GscError("Sitemap URL entry is missing <loc>", "INVALID_SITEMAP");
    }
    const value = decodeXml(match[1].trim());
    let url;
    try {
      url = new URL(value);
    } catch {
      throw new GscError("Sitemap contains an invalid URL", "INVALID_SITEMAP_URL");
    }
    if (
      url.origin !== CANONICAL_ORIGIN ||
      url.search ||
      url.hash ||
      (url.pathname !== "/" && url.pathname.endsWith("/"))
    ) {
      throw new GscError(
        "Sitemap contains a non-canonical host, query, fragment or trailing slash",
        "NON_CANONICAL_SITEMAP_URL",
      );
    }
    if (!seen.has(value)) {
      seen.add(value);
      urls.push(value);
    }
  }
  if (urls.length === 0) {
    throw new GscError("Sitemap contains no canonical URLs", "EMPTY_SITEMAP");
  }
  return urls;
}

function gscDates(days, now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  const today = new Date(`${part("year")}-${part("month")}-${part("day")}T00:00:00Z`);
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function searchAnalytics(accessToken, siteUrl, dates, dimensions) {
  const rows = [];
  let startRow = 0;
  let responseAggregationType = null;

  for (;;) {
    const response = await apiJson(
      `${propertyPath(siteUrl)}/searchAnalytics/query`,
      accessToken,
      "POST",
      {
        ...dates,
        type: "web",
        dataState: "final",
        dimensions,
        rowLimit: SEARCH_ANALYTICS_ROW_LIMIT,
        startRow,
      },
    );
    const batch = response.rows ?? [];
    if (!Array.isArray(batch)) {
      throw new GscError("Search Analytics returned invalid rows", "INVALID_ANALYTICS");
    }
    responseAggregationType = response.responseAggregationType ?? responseAggregationType;
    for (const row of batch) {
      if (!Array.isArray(row.keys) || row.keys.length !== dimensions.length) {
        throw new GscError("Search Analytics returned invalid row keys", "INVALID_ANALYTICS");
      }
      const values = Object.fromEntries(dimensions.map((name, i) => [name, row.keys[i]]));
      rows.push({
        ...values,
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        ctr: row.ctr ?? 0,
        position: row.position ?? 0,
      });
    }
    if (batch.length < SEARCH_ANALYTICS_ROW_LIMIT) break;
    startRow += batch.length;
  }

  return {
    ...dates,
    dataState: "final",
    searchType: "web",
    dimensions,
    responseAggregationType,
    rowCount: rows.length,
    rows,
  };
}

async function inspectUrl(accessToken, siteUrl, url) {
  try {
    const response = await apiJson(INSPECTION_URL, accessToken, "POST", {
      inspectionUrl: url,
      siteUrl,
    });
    const index = response.inspectionResult?.indexStatusResult;
    if (!index || typeof index !== "object") {
      throw new GscError(
        "URL Inspection returned no index status",
        "MISSING_INDEX_STATUS",
      );
    }
    return {
      url,
      status: "ok",
      verdict: index.verdict ?? null,
      coverageState: index.coverageState ?? null,
      indexingState: index.indexingState ?? null,
      robotsTxtState: index.robotsTxtState ?? null,
      pageFetchState: index.pageFetchState ?? null,
      lastCrawlTime: index.lastCrawlTime ?? null,
      googleCanonical: index.googleCanonical ?? null,
      userCanonical: index.userCanonical ?? null,
      ...(Array.isArray(index.referringUrls)
        ? { referringUrls: index.referringUrls }
        : {}),
      error: null,
    };
  } catch (error) {
    return {
      url,
      status: "error",
      verdict: null,
      coverageState: null,
      indexingState: null,
      robotsTxtState: null,
      pageFetchState: null,
      lastCrawlTime: null,
      googleCanonical: null,
      userCanonical: null,
      error: safeError(error),
    };
  }
}

async function saveSnapshot(snapshot) {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const stamp = snapshot.capturedAt.replace(/[:.]/g, "-");
  const filename = `gsc-snapshot-${stamp}.json`;
  const target = join(OUTPUT_DIR, filename);
  const temporary = `${target}.tmp`;
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: "wx" });
  await rename(temporary, target);
  return target;
}

async function main() {
  const command = process.argv[2];
  if (!new Set(["doctor", "snapshot"]).has(command) || process.argv.length !== 3) {
    throw new GscError(
      "Usage: npm run seo:gsc:doctor or npm run seo:gsc:snapshot",
      "INVALID_COMMAND",
    );
  }

  const config = await readConfig();
  if (command === "doctor") {
    console.log("PASS: local GSC settings present (secret values hidden)");
  }
  const accessToken = await getAccessToken(config);
  if (command === "doctor") console.log("PASS: OAuth refresh succeeded");

  const { sites, selected } = await verifyProperty(accessToken, config.siteUrl);
  if (command === "doctor") {
    console.log("Available Search Console properties:");
    for (const site of sites) {
      console.log(`- ${site.siteUrl} (${site.permissionLevel})`);
    }
  }
  if (!selected) {
    throw new GscError(
      `Selected property ${config.siteUrl} is not accessible to this Google account`,
      "PROPERTY_NOT_ACCESSIBLE",
    );
  }
  if (command === "doctor") {
    console.log(`PASS: selected property ${selected.siteUrl} (${selected.permissionLevel})`);
  }

  const submittedSitemap = await getSubmittedSitemap(accessToken, config.siteUrl);
  if (command === "doctor") {
    if (!submittedSitemap.submitted) {
      throw new GscError(
        `${SITEMAP_URL} is not listed as a submitted sitemap for ${config.siteUrl}`,
        "SITEMAP_NOT_SUBMITTED",
      );
    }
    console.log(
      `PASS: submitted sitemap found (pending=${submittedSitemap.isPending}, errors=${submittedSitemap.errors}, warnings=${submittedSitemap.warnings}, lastDownloaded=${submittedSitemap.lastDownloaded})`,
    );
    console.log("PASS: GSC read-only diagnostics ready");
    return;
  }

  const canonicalUrls = await getCanonicalUrls();
  console.log(`Canonical sitemap URLs: ${canonicalUrls.length}`);
  console.log("Reading finalized Search Analytics data (28d and 90d)...");
  const referenceTime = new Date();
  const dates28d = gscDates(28, referenceTime);
  const dates90d = gscDates(90, referenceTime);
  const page28d = await searchAnalytics(accessToken, config.siteUrl, dates28d, ["page"]);
  const page90d = await searchAnalytics(accessToken, config.siteUrl, dates90d, ["page"]);
  const queryPage90d = await searchAnalytics(
    accessToken,
    config.siteUrl,
    dates90d,
    ["query", "page"],
  );

  const inspections = [];
  for (const url of canonicalUrls) {
    const result = await inspectUrl(accessToken, config.siteUrl, url);
    inspections.push(result);
    if (result.error) {
      console.error(`Inspection failed for ${url}: ${result.error.code}`);
    }
    if (inspections.length % 10 === 0 || inspections.length === canonicalUrls.length) {
      console.log(`URL Inspection: ${inspections.length}/${canonicalUrls.length}`);
    }
  }

  const succeeded = inspections.filter((item) => item.status === "ok").length;
  const failed = inspections.length - succeeded;
  const snapshot = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    siteUrl: config.siteUrl,
    sitemap: {
      sourceUrl: SITEMAP_URL,
      canonicalUrlCount: canonicalUrls.length,
      submittedApiState: submittedSitemap,
    },
    searchAnalytics: {
      requestedPeriods: [28, 90],
      dataState: "final",
      searchType: "web",
      note: "An absent analytics row does not mean the URL is not indexed.",
      page28d,
      page90d,
      queryPage90d,
    },
    urlInspection: {
      note: "Indexed-version inspection only; this is not a live test or an indexing request.",
      results: inspections,
    },
    summary: {
      canonicalUrls: canonicalUrls.length,
      attempted: inspections.length,
      succeeded,
      failed,
      complete:
        inspections.length === canonicalUrls.length &&
        inspections.every(
          (item) => item.status === "ok" || (item.status === "error" && item.error),
        ),
    },
  };
  const output = await saveSnapshot(snapshot);
  console.log(`Snapshot saved: ${output}`);
  console.log(`Inspection: ${succeeded} succeeded, ${failed} failed; complete=${snapshot.summary.complete}`);
}

main().catch((error) => {
  const safe = safeError(error);
  console.error(`FAIL [${safe.code}]: ${safe.message}`);
  process.exitCode = 1;
});

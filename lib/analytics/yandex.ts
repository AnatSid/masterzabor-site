export type YandexPageStats = {
  path: string;
  views: number;
};

export type YandexMetrikaStats = {
  visitors: number;
  mobilePercent: number;
  desktopPercent: number;
  topPages: YandexPageStats[];
};

type YandexStatsResponse = {
  totals?: number[];
  data?: Array<{
    dimensions?: Array<{ name?: string; id?: string }>;
    metrics?: number[];
  }>;
};

const YANDEX_API_URL = "https://api-metrika.yandex.net/stat/v1/data";

function normalizePercentage(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function getDateRange(days: number) {
  if (days <= 1) {
    return { date1: "today", date2: "today" };
  }

  return { date1: `${days - 1}daysAgo`, date2: "today" };
}

async function requestYandexStats(
  token: string,
  counterId: string,
  query: Record<string, string>,
): Promise<YandexStatsResponse> {
  const search = new URLSearchParams({
    id: counterId,
    accuracy: "full",
    ...query,
  });
  const requestUrl = `${YANDEX_API_URL}?${search.toString()}`;

  const response = await fetch(requestUrl, {
    headers: {
      Authorization: `OAuth ${token}`,
    },
  });

  if (!response.ok) {
    console.error(`[analytics] Yandex API returned ${response.status}`);
    throw new Error(`Yandex Metrika API error: ${response.status}`);
  }

  return (await response.json()) as YandexStatsResponse;
}

export async function getYandexMetrikaStats(
  days = 1,
): Promise<YandexMetrikaStats> {
  const token = process.env.YANDEX_METRIKA_TOKEN;
  const counterId = process.env.YANDEX_METRIKA_COUNTER_ID;

  if (!token || !counterId) {
    throw new Error("Yandex Metrika credentials are not configured");
  }

  const dateRange = getDateRange(days);

  const [visitorsResponse, deviceResponse, pagesResponse] = await Promise.all([
    requestYandexStats(token, counterId, {
      metrics: "ym:s:users",
      date1: dateRange.date1,
      date2: dateRange.date2,
    }),
    requestYandexStats(token, counterId, {
      dimensions: "ym:s:deviceCategory",
      metrics: "ym:s:users",
      sort: "-ym:s:users",
      date1: dateRange.date1,
      date2: dateRange.date2,
      limit: "100",
    }),
    requestYandexStats(token, counterId, {
      dimensions: "ym:pv:URLPathFull",
      metrics: "ym:pv:pageviews",
      sort: "-ym:pv:pageviews",
      date1: dateRange.date1,
      date2: dateRange.date2,
      limit: "3",
    }),
  ]);

  const visitors = Number(visitorsResponse.totals?.[0] ?? 0);
  const mobileVisitors = (deviceResponse.data ?? [])
    .filter((entry) => {
      const deviceId = entry.dimensions?.[0]?.id?.toLowerCase();
      const deviceName = entry.dimensions?.[0]?.name?.toLowerCase();
      return (
        deviceId === "mobile" ||
        deviceId === "tablet" ||
        deviceName === "smartphone" ||
        deviceName === "smartphones" ||
        deviceName === "tablet"
      );
    })
    .reduce((sum, entry) => sum + Number(entry.metrics?.[0] ?? 0), 0);
  const desktopVisitors = (deviceResponse.data ?? [])
    .filter((entry) => {
      const deviceId = entry.dimensions?.[0]?.id?.toLowerCase();
      const deviceName = entry.dimensions?.[0]?.name?.toLowerCase();
      return (
        deviceId === "desktop" || deviceName === "desktop" || deviceName === "pc"
      );
    })
    .reduce((sum, entry) => sum + Number(entry.metrics?.[0] ?? 0), 0);

  const topPages = (pagesResponse.data ?? []).map((entry) => ({
    path: entry.dimensions?.[0]?.name || "/",
    views: Number(entry.metrics?.[0] ?? 0),
  }));

  return {
    visitors,
    mobilePercent: normalizePercentage(mobileVisitors, visitors),
    desktopPercent: normalizePercentage(desktopVisitors, visitors),
    topPages,
  };
}

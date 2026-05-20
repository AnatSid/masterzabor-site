import { BetaAnalyticsDataClient } from "@google-analytics/data";

export type Ga4PageStats = {
  path: string;
  views: number;
};

export type Ga4Stats = {
  users: number;
  mobilePercent: number;
  desktopPercent: number;
  topPages: Ga4PageStats[];
};

function normalizePercentage(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function normalizePrivateKey(rawKey: string) {
  return rawKey.replace(/\\n/g, "\n");
}

function getClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Google Analytics credentials are not configured");
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: normalizePrivateKey(privateKey),
    },
  });
}

function getDateRange(days: number) {
  if (days <= 1) {
    return { startDate: "today", endDate: "today" };
  }

  return { startDate: `${days - 1}daysAgo`, endDate: "today" };
}

export async function getGa4Stats(days = 1): Promise<Ga4Stats> {
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId) {
    throw new Error("GA_PROPERTY_ID is not configured");
  }

  const dateRange = getDateRange(days);
  const client = getClient();

  const [usersReport] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [dateRange],
    metrics: [{ name: "activeUsers" }],
  });

  const [deviceReport] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [dateRange],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "activeUsers" }],
  });

  const [pagesReport] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [dateRange],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [
      {
        metric: {
          metricName: "screenPageViews",
        },
        desc: true,
      },
    ],
    limit: 3,
  });

  const users = Number(usersReport.rows?.[0]?.metricValues?.[0]?.value ?? 0);
  const mobileUsers = (deviceReport.rows ?? [])
    .filter((row) => row.dimensionValues?.[0]?.value === "mobile")
    .reduce((sum, row) => sum + Number(row.metricValues?.[0]?.value ?? 0), 0);
  const desktopUsers = (deviceReport.rows ?? [])
    .filter((row) => row.dimensionValues?.[0]?.value === "desktop")
    .reduce((sum, row) => sum + Number(row.metricValues?.[0]?.value ?? 0), 0);
  const topPages = (pagesReport.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value || "/",
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }));

  return {
    users,
    mobilePercent: normalizePercentage(mobileUsers, users),
    desktopPercent: normalizePercentage(desktopUsers, users),
    topPages,
  };
}

import {
  getAnalyticsDateRange,
  normalizePercentage,
} from "@/lib/analytics/utils";

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

type Ga4ReportResponse = {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
};

const GOOGLE_OAUTH_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_GA4_RUN_REPORT_BASE =
  "https://analyticsdata.googleapis.com/v1beta/properties";

function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!propertyId) {
    throw new Error("GA_PROPERTY_ID is not configured");
  }

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Google Analytics OAuth is not configured (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)",
    );
  }

  return { propertyId, clientId, clientSecret, refreshToken };
}

async function readResponseTextSafe(response: Response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function buildGoogleApiError(prefix: string, status: number, responseText: string) {
  const limited = responseText.slice(0, 500);
  return new Error(`${prefix}. status=${status}${limited ? ` body=${limited}` : ""}`);
}

async function getGoogleAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
) {
  const response = await fetch(GOOGLE_OAUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const responseText = await readResponseTextSafe(response);
    throw buildGoogleApiError(
      "[analytics] Google OAuth token request failed",
      response.status,
      responseText,
    );
  }

  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) {
    throw new Error("[analytics] Google OAuth response missing access_token");
  }

  return payload.access_token;
}

async function runGa4Report(
  propertyId: string,
  accessToken: string,
  body: Record<string, unknown>,
): Promise<Ga4ReportResponse> {
  const response = await fetch(
    `${GOOGLE_GA4_RUN_REPORT_BASE}/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const responseText = await readResponseTextSafe(response);
    throw buildGoogleApiError(
      "[analytics] Google GA4 runReport failed",
      response.status,
      responseText,
    );
  }

  return (await response.json()) as Ga4ReportResponse;
}

async function fetchGa4Reports(days: number) {
  const { propertyId, clientId, clientSecret, refreshToken } =
    getGoogleOAuthConfig();
  const accessToken = await getGoogleAccessToken(
    clientId,
    clientSecret,
    refreshToken,
  );
  const dateRange = getAnalyticsDateRange(days);

  const [usersReport, deviceReport, pagesReport] = await Promise.all([
    runGa4Report(propertyId, accessToken, {
      dateRanges: [dateRange],
      metrics: [{ name: "activeUsers" }],
    }),
    runGa4Report(propertyId, accessToken, {
      dateRanges: [dateRange],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }],
    }),
    runGa4Report(propertyId, accessToken, {
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
    }),
  ]);

  return { usersReport, deviceReport, pagesReport };
}

export async function getGa4Stats(days = 1): Promise<Ga4Stats> {
  const { usersReport, deviceReport, pagesReport } = await fetchGa4Reports(days);

  const users = Number(usersReport.rows?.[0]?.metricValues?.[0]?.value ?? 0);
  const mobileUsers = (deviceReport.rows ?? [])
    .filter((row) => {
      const device = row.dimensionValues?.[0]?.value?.toLowerCase();
      return device === "mobile" || device === "tablet";
    })
    .reduce((sum, row) => sum + Number(row.metricValues?.[0]?.value ?? 0), 0);
  const desktopUsers = (deviceReport.rows ?? [])
    .filter((row) => row.dimensionValues?.[0]?.value?.toLowerCase() === "desktop")
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

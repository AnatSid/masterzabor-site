import { NextRequest, NextResponse } from "next/server";
import { aggregateLeads, getLeadsByKeys, getRangeKeys } from "@/lib/leads";

export const runtime = "nodejs";

const PERIOD_DAYS = {
  today: 1,
  week: 7,
  month: 30,
} as const;

type StatsPeriod = keyof typeof PERIOD_DAYS;

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return "";
  }

  return header.slice("Bearer ".length).trim();
}

export async function GET(request: NextRequest) {
  const configuredToken = process.env.STATS_API_TOKEN;

  if (!configuredToken) {
    return NextResponse.json(
      { error: "STATS_API_TOKEN не настроен" },
      { status: 500 },
    );
  }

  const requestToken = getBearerToken(request);

  if (requestToken !== configuredToken) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 401 });
  }

  const period = request.nextUrl.searchParams.get("period") as
    | StatsPeriod
    | null;
  const normalizedPeriod: StatsPeriod = period && period in PERIOD_DAYS ? period : "today";
  const keys = getRangeKeys(PERIOD_DAYS[normalizedPeriod]);
  const leadsByKey = await getLeadsByKeys(keys);
  const allLeads = leadsByKey.flatMap((entry) => entry.leads);
  const aggregated = aggregateLeads(allLeads);

  return NextResponse.json({
    period: normalizedPeriod,
    totalLeads: aggregated.totalLeads,
    bySource: aggregated.bySource,
    byCity: aggregated.byCity,
    byDay: aggregated.byDay,
  });
}

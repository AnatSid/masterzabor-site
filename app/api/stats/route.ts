import { NextRequest, NextResponse } from "next/server";
import { getAggregatedStats } from "@/lib/reporting";

export const runtime = "nodejs";
type StatsPeriod = "today" | "week" | "month";
const ALLOWED_PERIODS: readonly StatsPeriod[] = ["today", "week", "month"];

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
  const normalizedPeriod: StatsPeriod =
    period && ALLOWED_PERIODS.includes(period) ? period : "today";
  const aggregated = await getAggregatedStats(normalizedPeriod);

  return NextResponse.json({
    period: aggregated.period,
    totalLeads: aggregated.totalLeads,
    bySource: aggregated.bySource,
    byCity: aggregated.byCity,
    byDay: aggregated.byDay,
  });
}

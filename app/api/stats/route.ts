import { NextRequest, NextResponse } from "next/server";
import { getAggregatedStats } from "@/lib/reporting";
import { validateBearerSecret } from "@/lib/request-auth";

export const runtime = "nodejs";
type StatsPeriod = "today" | "week" | "month";
const ALLOWED_PERIODS: readonly StatsPeriod[] = ["today", "week", "month"];

export async function GET(request: NextRequest) {
  const authError = validateBearerSecret(request, "STATS_API_TOKEN");
  if (authError) {
    return authError;
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

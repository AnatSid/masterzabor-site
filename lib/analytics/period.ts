export type AnalyticsPeriod = "today" | "week" | "month";

export const ANALYTICS_PERIOD_DAYS: Record<AnalyticsPeriod, number> = {
  today: 1,
  week: 7,
  month: 30,
};

export function getAnalyticsDays(period: AnalyticsPeriod) {
  return ANALYTICS_PERIOD_DAYS[period];
}

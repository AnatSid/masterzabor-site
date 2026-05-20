export function normalizePercentage(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export function getAnalyticsDateRange(days: number) {
  if (days <= 1) {
    return { startDate: "today", endDate: "today" };
  }

  return { startDate: `${days - 1}daysAgo`, endDate: "today" };
}

import {
  aggregateLeads,
  getLeadsByKeys,
  getMonthToDateKeys,
  getRangeKeys,
  getTodayLeadKey,
} from "@/lib/leads";

const MINSK_TIME_ZONE = "Europe/Minsk";

export type StatsPeriod = "today" | "week" | "month";

const PERIOD_DAYS: Record<StatsPeriod, number> = {
  today: 1,
  week: 7,
  month: 30,
};

export function getTopEntry(values: Record<string, number>) {
  return Object.entries(values).sort((a, b) => b[1] - a[1])[0];
}

export function sourceToPagePath(source: string) {
  if (source.startsWith("city-")) {
    const slug = source.slice("city-".length);
    return slug ? `/${slug}/` : source;
  }

  if (source.startsWith("service-")) {
    const slug = source.slice("service-".length);
    return slug ? `/${slug}/` : source;
  }

  if (source.startsWith("blog-post-")) {
    const slug = source.slice("blog-post-".length);
    return slug ? `/blog/${slug}/` : source;
  }

  if (source === "home-quiz" || source === "home-lead-form") {
    return "/";
  }

  if (source === "prices-page") {
    return "/tseny/";
  }

  if (source === "contacts-page") {
    return "/kontakty/";
  }

  return source;
}

export function formatReportDate() {
  return new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "long",
    timeZone: MINSK_TIME_ZONE,
  }).format(new Date());
}

export async function getAggregatedStats(period: StatsPeriod) {
  const keys = getRangeKeys(PERIOD_DAYS[period]);
  const leadsByKey = await getLeadsByKeys(keys);
  const leads = leadsByKey.flatMap((entry) => entry.leads);

  return {
    period,
    ...aggregateLeads(leads),
  };
}

export async function getDailyReportSnapshot() {
  const todayLeads = await getLeadsByKeys([getTodayLeadKey()]);
  const todayItems = todayLeads.flatMap((entry) => entry.leads);

  const monthLeads = await getLeadsByKeys(getMonthToDateKeys());
  const monthItems = monthLeads.flatMap((entry) => entry.leads);

  const todayAggregated = aggregateLeads(todayItems);
  const topSource = getTopEntry(todayAggregated.bySource);

  return {
    today: todayItems.length,
    month: monthItems.length,
    topSource,
    text: [
      `📊 Сводка за ${formatReportDate()}`,
      "",
      `Заявок за день: ${todayItems.length}`,
      `Топ страница: ${topSource ? `${sourceToPagePath(topSource[0])} (${topSource[1]})` : "—"}`,
      `Итого за месяц: ${monthItems.length}`,
    ].join("\n"),
  };
}

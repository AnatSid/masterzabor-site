import {
  aggregateLeads,
  getLeadsByKeys,
  getMonthToDateKeys,
  getRangeKeys,
  getTodayLeadKey,
} from "@/lib/leads";
import type { ConversionEventSummary } from "@/lib/conversion-events";
import { getConversionEventSummaryByKeys } from "@/lib/conversion-events";
import { normalizePath } from "@/lib/url";

const MINSK_TIME_ZONE = "Europe/Minsk";
const SECTION_SEPARATOR = "___________";

function stripYearSuffix(value: string) {
  return value.replace(/\s*г\.?$/u, "");
}

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
    return slug ? normalizePath(`/${slug}`) : source;
  }

  if (source.startsWith("service-")) {
    const slug = source.slice("service-".length);
    return slug ? normalizePath(`/${slug}`) : source;
  }

  if (source.startsWith("blog-post-")) {
    const slug = source.slice("blog-post-".length);
    return slug ? normalizePath(`/blog/${slug}`) : source;
  }

  if (source === "home-quiz" || source === "home-lead-form") {
    return "/";
  }

  if (source === "prices-page") {
    return "/tseny";
  }

  if (source === "contacts-page") {
    return "/kontakty";
  }

  return source;
}

export function formatTopSource(bySource: Record<string, number>) {
  const topSource = getTopEntry(bySource);
  if (!topSource) {
    return "—";
  }

  return `${sourceToPagePath(topSource[0])} (${topSource[1]})`;
}

export function formatReportDate(date = new Date()) {
  return stripYearSuffix(new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "long",
    timeZone: MINSK_TIME_ZONE,
  }).format(date));
}

export function formatReportMonth(date = new Date()) {
  return stripYearSuffix(new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
    timeZone: MINSK_TIME_ZONE,
  }).format(date));
}

function formatContactClickLines(events: ConversionEventSummary) {
  return [
    `звонки: ${events.contactClicks.call}`,
    `Telegram: ${events.contactClicks.telegram}`,
    `WhatsApp: ${events.contactClicks.whatsapp}`,
    `Viber: ${events.contactClicks.viber}`,
  ];
}

function formatQuizFunnelLines(events: ConversionEventSummary) {
  return [
    `начали: ${events.quizFunnel.started}`,
    `прошли 2 шага и более: ${events.quizFunnel.step3Reached}`,
    `дошли до шага контактов: ${events.quizFunnel.contactStepReached}`,
  ];
}

export async function getAggregatedStats(period: StatsPeriod) {
  const keys = getRangeKeys(PERIOD_DAYS[period]);
  const [leadsByKey, conversionEvents] = await Promise.all([
    getLeadsByKeys(keys),
    getConversionEventSummaryByKeys(keys),
  ]);
  const leads = leadsByKey.flatMap((entry) => entry.leads);

  return {
    period,
    conversionEvents,
    ...aggregateLeads(leads),
  };
}

export function formatAggregatedStatsText(
  stats: Awaited<ReturnType<typeof getAggregatedStats>>,
  periodLabel: string,
) {
  return [
    `📊 Статистика за ${periodLabel}`,
    "",
    `Заявок: ${stats.totalLeads}`,
    `Топ страница: ${formatTopSource(stats.bySource)}`,
    `Городских лидов (по source city-{slug}): ${Object.values(stats.byCity).reduce((sum, value) => sum + value, 0)}`,
    "",
    SECTION_SEPARATOR,
    "",
    "Контактные клики:",
    ...formatContactClickLines(stats.conversionEvents),
    `Итого контактных кликов: ${stats.conversionEvents.contactClicks.total}`,
    "",
    SECTION_SEPARATOR,
    "",
    "Квиз:",
    ...formatQuizFunnelLines(stats.conversionEvents),
  ].join("\n");
}

export function formatDailyReportText({
  reportDate,
  monthLabel,
  todayLeads,
  monthLeads,
  topSource,
  todayEvents,
  monthEvents,
}: {
  reportDate: string;
  monthLabel: string;
  todayLeads: number;
  monthLeads: number;
  topSource: string;
  todayEvents: ConversionEventSummary;
  monthEvents: ConversionEventSummary;
}) {
  return [
    `📊 Сводка за ${reportDate}`,
    "",
    `Заявок за день: ${todayLeads}`,
    `Топ страница: ${topSource}`,
    `Итого заявок за ${monthLabel}: ${monthLeads}`,
    "",
    SECTION_SEPARATOR,
    "",
    `Контактные клики за ${reportDate}:`,
    ...formatContactClickLines(todayEvents),
    "",
    `Контактные клики за ${monthLabel}:`,
    ...formatContactClickLines(monthEvents),
    `Итого контактных кликов за ${monthLabel}: ${monthEvents.contactClicks.total}`,
    "",
    SECTION_SEPARATOR,
    "",
    `Квиз за ${reportDate}:`,
    ...formatQuizFunnelLines(todayEvents),
    "",
    `Квиз за ${monthLabel}:`,
    ...formatQuizFunnelLines(monthEvents),
  ].join("\n");
}

export async function getDailyReportSnapshot() {
  const todayKey = getTodayLeadKey();
  const monthKeys = getMonthToDateKeys();
  const [todayLeads, todayEvents, monthLeads, monthEvents] = await Promise.all([
    getLeadsByKeys([todayKey]),
    getConversionEventSummaryByKeys([todayKey]),
    getLeadsByKeys(monthKeys),
    getConversionEventSummaryByKeys(monthKeys),
  ]);
  const todayItems = todayLeads.flatMap((entry) => entry.leads);
  const monthItems = monthLeads.flatMap((entry) => entry.leads);

  const todayAggregated = aggregateLeads(todayItems);
  const topSource = getTopEntry(todayAggregated.bySource);
  const reportDate = formatReportDate();
  const monthLabel = formatReportMonth();

  return {
    today: todayItems.length,
    month: monthItems.length,
    topSource,
    text: formatDailyReportText({
      reportDate,
      monthLabel,
      todayLeads: todayItems.length,
      monthLeads: monthItems.length,
      topSource: topSource
        ? `${sourceToPagePath(topSource[0])} (${topSource[1]})`
        : "—",
      todayEvents,
      monthEvents,
    }),
  };
}

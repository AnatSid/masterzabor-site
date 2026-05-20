import {
  AnalyticsPeriod,
  getAnalyticsDays,
} from "@/lib/analytics/period";

export type BotPeriod = AnalyticsPeriod;

const MINSK_TIME_ZONE = "Europe/Minsk";

function getMinskYmd(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: MINSK_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  return {
    y: Number(parts.year),
    m: Number(parts.month),
    d: Number(parts.day),
  };
}

function shiftMinskCalendarDay(date: Date, dayOffset: number) {
  const { y, m, d } = getMinskYmd(date);
  return new Date(Date.UTC(y, m - 1, d + dayOffset));
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("ru-BY", {
    day: "numeric",
    timeZone: MINSK_TIME_ZONE,
  }).format(date);
}

function formatDayMonth(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: MINSK_TIME_ZONE,
  }).format(date);
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "long",
    timeZone: MINSK_TIME_ZONE,
  }).format(date);
}

function formatDateRange(start: Date, end: Date) {
  const startYmd = getMinskYmd(start);
  const endYmd = getMinskYmd(end);
  const endDayMonth = formatDayMonth(end);
  const endMonthName = endDayMonth.replace(/^\d+\s+/, "");

  if (startYmd.y === endYmd.y && startYmd.m === endYmd.m) {
    return `${formatDay(start)}–${formatDay(end)} ${endMonthName} ${endYmd.y}`;
  }

  return `${formatDayMonth(start)} – ${endDayMonth} ${endYmd.y}`;
}

export function formatTrafficReportTitle(period: BotPeriod) {
  const today = new Date();

  if (period === "today") {
    return `📈 Трафик сайта за ${formatLongDate(today)}`;
  }

  const days = getAnalyticsDays(period);
  const end = today;
  const start = shiftMinskCalendarDay(today, -(days - 1));

  return `📈 Трафик за ${formatDateRange(start, end)}`;
}

export function formatStatsPeriodLabel(period: BotPeriod) {
  if (period === "today") {
    return "сегодня";
  }

  const days = getAnalyticsDays(period);
  const end = new Date();
  const start = shiftMinskCalendarDay(end, -(days - 1));

  return formatDateRange(start, end);
}

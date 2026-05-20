import { Ga4Stats, getGa4Stats } from "@/lib/analytics/google";
import { getYandexMetrikaStats, YandexMetrikaStats } from "@/lib/analytics/yandex";

const MINSK_TIME_ZONE = "Europe/Minsk";

export type TrafficPeriod = "today" | "week" | "month";

type TrafficAnalyticsResult = {
  google: Ga4Stats | null;
  yandex: YandexMetrikaStats | null;
  warnings: string[];
};

const PERIOD_DAYS: Record<TrafficPeriod, number> = {
  today: 1,
  week: 7,
  month: 30,
};

function getFormattedDate() {
  return new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "long",
    timeZone: MINSK_TIME_ZONE,
  }).format(new Date());
}

function normalizeTopPages<T extends { path: string; views: number }>(pages: T[]) {
  const normalized = pages.slice(0, 3);
  while (normalized.length < 3) {
    normalized.push({ path: "—", views: 0 } as T);
  }
  return normalized;
}

function buildTopPagesLines(topPages: Array<{ path: string; views: number }>) {
  const pages = normalizeTopPages(topPages);
  return pages.map((entry, index) => `${index + 1}. ${entry.path} — ${entry.views}`);
}

export async function getTrafficAnalytics(
  period: TrafficPeriod,
): Promise<TrafficAnalyticsResult> {
  const days = PERIOD_DAYS[period];
  const warnings: string[] = [];

  const [googleResult, yandexResult] = await Promise.allSettled([
    getGa4Stats(days),
    getYandexMetrikaStats(days),
  ]);

  const google =
    googleResult.status === "fulfilled" ? googleResult.value : null;
  const yandex =
    yandexResult.status === "fulfilled" ? yandexResult.value : null;

  if (googleResult.status === "rejected") {
    console.error("Google Analytics traffic request failed", googleResult.reason);
    warnings.push("⚠️ Google Analytics временно недоступен");
  }

  if (yandexResult.status === "rejected") {
    console.error("Yandex Metrika traffic request failed", yandexResult.reason);
    warnings.push("⚠️ Яндекс.Метрика временно недоступна");
  }

  return { google, yandex, warnings };
}

export async function getTrafficReportText(period: TrafficPeriod) {
  const analytics = await getTrafficAnalytics(period);
  const lines: string[] = [`📈 Трафик сайта за ${getFormattedDate()}`, ""];

  if (analytics.warnings.length) {
    lines.push(...analytics.warnings, "");
  }

  if (analytics.google) {
    lines.push(
      "GOOGLE ANALYTICS:",
      `👥 Пользователи: ${analytics.google.users}`,
      "",
      "🔥 Топ страницы:",
      "",
      ...buildTopPagesLines(analytics.google.topPages),
      "",
      `📱 Mobile: ${analytics.google.mobilePercent}%`,
      `💻 Desktop: ${analytics.google.desktopPercent}%`,
      "",
    );
  }

  if (analytics.yandex) {
    lines.push(
      "ЯНДЕКС.МЕТРИКА:",
      `👥 Посетители: ${analytics.yandex.visitors}`,
      "",
      "🔥 Топ страницы:",
      "",
      ...buildTopPagesLines(analytics.yandex.topPages),
      "",
      `📱 Mobile: ${analytics.yandex.mobilePercent}%`,
      `💻 Desktop: ${analytics.yandex.desktopPercent}%`,
      "",
    );
  }

  if (!analytics.google && !analytics.yandex) {
    lines.push("⚠️ Источники аналитики временно недоступны");
  }

  const text = lines.join("\n").trim();

  return {
    ...analytics,
    period,
    text,
  };
}

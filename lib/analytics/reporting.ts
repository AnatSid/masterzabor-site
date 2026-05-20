import { Ga4Stats, getGa4Stats } from "@/lib/analytics/google";
import {
  AnalyticsPeriod,
  getAnalyticsDays,
} from "@/lib/analytics/period";
import { getYandexMetrikaStats, YandexMetrikaStats } from "@/lib/analytics/yandex";
import { formatTrafficReportTitle } from "@/lib/telegram-period";

export type TrafficPeriod = AnalyticsPeriod;

type TrafficAnalyticsResult = {
  google: Ga4Stats | null;
  yandex: YandexMetrikaStats | null;
  warnings: string[];
};

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
  const days = getAnalyticsDays(period);
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
    console.error("[analytics] Google request failed", googleResult.reason);
    warnings.push("⚠️ Google Analytics временно недоступен");
  }

  if (yandexResult.status === "rejected") {
    console.error("[analytics] Yandex request failed", yandexResult.reason);
    warnings.push("⚠️ Яндекс.Метрика временно недоступна");
  }

  return { google, yandex, warnings };
}

export async function getTrafficReportText(period: TrafficPeriod) {
  const analytics = await getTrafficAnalytics(period);
  const lines: string[] = [formatTrafficReportTitle(period), ""];

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

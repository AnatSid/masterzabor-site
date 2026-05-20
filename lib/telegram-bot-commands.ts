import type { BotPeriod } from "@/lib/telegram-period";
import type { TrafficPeriod } from "@/lib/analytics/reporting";

export type TelegramBotCommand = {
  command: string;
  description: string;
};

export const TELEGRAM_BOT_COMMANDS: TelegramBotCommand[] = [
  { command: "report", description: "Сводка заявок за день" },
  { command: "stats_today", description: "Заявки за сегодня" },
  { command: "stats_week", description: "Заявки за 7 дней" },
  { command: "stats_month", description: "Заявки за 30 дней" },
  { command: "traffic_today", description: "Трафик за сегодня" },
  { command: "traffic_week", description: "Трафик за 7 дней" },
  { command: "traffic_month", description: "Трафик за 30 дней" },
  { command: "top", description: "Топ страница за сегодня" },
  { command: "help", description: "Список команд" },
];

const TRAFFIC_PERIOD_BY_COMMAND: Record<string, TrafficPeriod> = {
  "/traffic_today": "today",
  "/traffic_week": "week",
  "/traffic_month": "month",
};

const STATS_PERIOD_BY_COMMAND: Record<string, BotPeriod> = {
  "/stats_today": "today",
  "/stats_week": "week",
  "/stats_month": "month",
};

function parseLegacyPeriodArg(arg: string): BotPeriod | null {
  if (arg === "week" || arg === "month" || arg === "today") {
    return arg;
  }
  return null;
}

export function resolveTrafficPeriod(
  command: string,
  arg: string,
): TrafficPeriod | null {
  const mapped = TRAFFIC_PERIOD_BY_COMMAND[command];
  if (mapped) {
    return mapped;
  }

  if (command === "/traffic") {
    return parseLegacyPeriodArg(arg) ?? "today";
  }

  return null;
}

export function resolveStatsPeriod(
  command: string,
  arg: string,
): BotPeriod | null {
  const mapped = STATS_PERIOD_BY_COMMAND[command];
  if (mapped) {
    return mapped;
  }

  if (command === "/stats") {
    return parseLegacyPeriodArg(arg) ?? "today";
  }

  return null;
}

export function getTelegramBotHelpText() {
  return [
    "Доступные команды:",
    "",
    "Заявки:",
    "/report — сводка за день",
    "/stats_today — за сегодня",
    "/stats_week — за 7 дней",
    "/stats_month — за 30 дней",
    "/stats — за сегодня (как /stats_today)",
    "/stats week — за 7 дней (как /stats_week)",
    "",
    "Трафик:",
    "/traffic_today — за сегодня",
    "/traffic_week — за 7 дней",
    "/traffic_month — за 30 дней",
    "/traffic — за сегодня (как /traffic_today)",
    "/traffic week — за 7 дней (как /traffic_week)",
    "",
    "Прочее:",
    "/top — топ страница за сегодня",
    "/help — этот список",
  ].join("\n");
}

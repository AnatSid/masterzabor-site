import { NextRequest, NextResponse } from "next/server";
import { getAggregatedStats, getDailyReportSnapshot } from "@/lib/reporting";
import { sendTelegramTextToChat } from "@/lib/telegram";

export const runtime = "nodejs";

type TelegramUpdate = {
  message?: {
    chat?: {
      id?: number;
    };
    text?: string;
  };
};

function normalizeCommand(text: string) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) {
    return { command: "", arg: "" };
  }

  const [rawCommand, ...rest] = trimmed.split(/\s+/);
  const command = rawCommand.split("@")[0].toLowerCase();
  const arg = rest.join(" ").trim().toLowerCase();

  return { command, arg };
}

function formatStatsLabel(period: "today" | "week" | "month") {
  if (period === "today") {
    return "сегодня";
  }
  if (period === "week") {
    return "за 7 дней";
  }
  return "за 30 дней";
}

function formatTopSource(bySource: Record<string, number>) {
  const top = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0];
  if (!top) {
    return "—";
  }
  return `${top[0]} (${top[1]})`;
}

function helpText() {
  return [
    "Доступные команды:",
    "/report — отправить сводку за день",
    "/stats — статистика за сегодня",
    "/stats week — статистика за 7 дней",
    "/stats month — статистика за 30 дней",
    "/top — топ страницы за сегодня",
  ].join("\n");
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (webhookSecret) {
    const requestSecret = request.headers.get("x-telegram-bot-api-secret-token");
    if (requestSecret !== webhookSecret) {
      return NextResponse.json({ ok: true });
    }
  }

  let body: TelegramUpdate;
  try {
    body = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = body.message?.chat?.id;
  const text = body.message?.text;
  if (!chatId || !text) {
    return NextResponse.json({ ok: true });
  }

  const allowedChatId = process.env.TELEGRAM_CHAT_ID;
  if (allowedChatId && String(chatId) !== allowedChatId) {
    return NextResponse.json({ ok: true });
  }

  const { command, arg } = normalizeCommand(text);
  let responseText = "";

  if (command === "/report") {
    const snapshot = await getDailyReportSnapshot();
    responseText = snapshot.text;
  } else if (command === "/stats") {
    const period =
      arg === "week" || arg === "month" || arg === "today" ? arg : "today";
    const stats = await getAggregatedStats(period);
    responseText = [
      `Статистика ${formatStatsLabel(period)}:`,
      `Заявок: ${stats.totalLeads}`,
      `Топ страницы: ${formatTopSource(stats.bySource)}`,
      `Городских лидов (по source city-{slug}): ${Object.values(stats.byCity).reduce((sum, value) => sum + value, 0)}`,
    ].join("\n");
  } else if (command === "/top") {
    const stats = await getAggregatedStats("today");
    responseText = `Топ страница за сегодня: ${formatTopSource(stats.bySource)}`;
  } else {
    responseText = helpText();
  }

  await sendTelegramTextToChat(String(chatId), responseText);
  return NextResponse.json({ ok: true });
}

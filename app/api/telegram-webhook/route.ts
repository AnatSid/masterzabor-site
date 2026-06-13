import { NextRequest, NextResponse } from "next/server";
import { getAggregatedStats, getDailyReportSnapshot } from "@/lib/reporting";
import { getTrafficReportText } from "@/lib/analytics/reporting";
import {
  getTelegramBotHelpText,
  resolveStatsPeriod,
  resolveTrafficPeriod,
} from "@/lib/telegram-bot-commands";
import { isVercelProduction } from "@/lib/request-auth";
import { formatStatsPeriodLabel } from "@/lib/telegram-period";
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

function formatTopSource(bySource: Record<string, number>) {
  const top = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0];
  if (!top) {
    return "—";
  }
  return `${top[0]} (${top[1]})`;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!webhookSecret && isVercelProduction()) {
    console.error("TELEGRAM_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ ok: true });
  }

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
  if (!allowedChatId && isVercelProduction()) {
    console.error("TELEGRAM_CHAT_ID is not configured");
    return NextResponse.json({ ok: true });
  }

  if (allowedChatId && String(chatId) !== allowedChatId) {
    await sendTelegramTextToChat(
      String(chatId),
      "⛔ Команды бота доступны только в основном чате. Откройте личный диалог с ботом и отправьте команду там.",
    );
    return NextResponse.json({ ok: true });
  }

  const { command, arg } = normalizeCommand(text);
  let responseText = "";

  try {
    if (command === "/report") {
      const snapshot = await getDailyReportSnapshot();
      responseText = snapshot.text;
    } else {
      const statsPeriod = resolveStatsPeriod(command, arg);
      if (statsPeriod) {
        const stats = await getAggregatedStats(statsPeriod);
        responseText = [
          `Статистика за ${formatStatsPeriodLabel(statsPeriod)}:`,
          `Заявок: ${stats.totalLeads}`,
          `Топ страницы: ${formatTopSource(stats.bySource)}`,
          `Городских лидов (по source city-{slug}): ${Object.values(stats.byCity).reduce((sum, value) => sum + value, 0)}`,
        ].join("\n");
      } else {
        const trafficPeriod = resolveTrafficPeriod(command, arg);
        if (trafficPeriod) {
          const traffic = await getTrafficReportText(trafficPeriod);
          responseText = traffic.text;
        } else if (command === "/top") {
          const stats = await getAggregatedStats("today");
          responseText = `Топ страница за сегодня: ${formatTopSource(stats.bySource)}`;
        } else if (command === "/help" || command === "/start") {
          responseText = getTelegramBotHelpText();
        } else {
          responseText = getTelegramBotHelpText();
        }
      }
    }
  } catch (error) {
    console.error("Telegram webhook command failed", error);
    responseText = "⚠️ Временная ошибка при обработке команды";
  }

  const sent = await sendTelegramTextToChat(String(chatId), responseText);
  if (!sent) {
    console.error("Telegram webhook: failed to send response", { chatId, command });
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import {
  formatAggregatedStatsText,
  formatTopSource,
  getAggregatedStats,
  getDailyReportSnapshot,
} from "@/lib/reporting";
import { getTrafficReportText } from "@/lib/analytics/reporting";
import {
  getTelegramBotHelpText,
  normalizeTelegramCommand,
  resolveLeadId,
  resolveLeadsPeriod,
  resolveStatsPeriod,
  resolveTrafficPeriod,
} from "@/lib/telegram-bot-commands";
import { isVercelProduction } from "@/lib/request-auth";
import { formatStatsPeriodLabel } from "@/lib/telegram-period";
import { sendTelegramTextToChat } from "@/lib/telegram";
import { getAnalyticsDays } from "@/lib/analytics/period";
import { findLeadById, getLeadsForDays } from "@/lib/leads";
import {
  createDetailedLeadMessages,
  createStoredLeadMessages,
  LEAD_NOT_FOUND_MESSAGE,
  type OutgoingTelegramMessage,
} from "@/lib/lead-retrieval";

export const runtime = "nodejs";

type TelegramUpdate = {
  message?: {
    chat?: {
      id?: number;
    };
    text?: string;
  };
};

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

  const { command, arg } = normalizeTelegramCommand(text);
  let responseMessages: OutgoingTelegramMessage[] = [];

  try {
    if (command === "/report") {
      const snapshot = await getDailyReportSnapshot();
      responseMessages = [{ text: snapshot.text }];
    } else {
      const statsPeriod = resolveStatsPeriod(command, arg);
      if (statsPeriod) {
        const stats = await getAggregatedStats(statsPeriod);
        responseMessages = [
          {
            text: formatAggregatedStatsText(
              stats,
              formatStatsPeriodLabel(statsPeriod),
            ),
          },
        ];
      } else {
        const leadsPeriod = resolveLeadsPeriod(command);
        if (leadsPeriod) {
          const leads = await getLeadsForDays(getAnalyticsDays(leadsPeriod));
          responseMessages = createDetailedLeadMessages(
            leads,
            `Заявки за ${formatStatsPeriodLabel(leadsPeriod)}: ${leads.length}`,
          );
        } else if (command === "/lead") {
          const leadId = resolveLeadId(command, arg);
          if (!leadId) {
            responseMessages = [{ text: "Использование: /lead <id>" }];
          } else {
            const lead = await findLeadById(leadId);
            responseMessages = lead
              ? createStoredLeadMessages(lead)
              : [{ text: LEAD_NOT_FOUND_MESSAGE }];
          }
        } else {
          const trafficPeriod = resolveTrafficPeriod(command, arg.toLowerCase());
          if (trafficPeriod) {
            const traffic = await getTrafficReportText(trafficPeriod);
            responseMessages = [{ text: traffic.text }];
          } else if (command === "/top") {
            const stats = await getAggregatedStats("today");
            responseMessages = [
              {
                text: `Топ страница за сегодня: ${formatTopSource(stats.bySource)}`,
              },
            ];
          } else {
            responseMessages = [{ text: getTelegramBotHelpText() }];
          }
        }
      }
    }
  } catch (error) {
    console.error("Telegram webhook command failed", error);
    responseMessages = [{ text: "⚠️ Временная ошибка при обработке команды" }];
  }

  for (const message of responseMessages) {
    const sent = await sendTelegramTextToChat(
      String(chatId),
      message.text,
      message.parseMode,
    );
    if (!sent) {
      console.error("Telegram webhook: failed to send response", {
        chatId,
        command,
      });
      return NextResponse.json(
        { ok: false, error: "send_failed" },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}

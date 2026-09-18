import { calculateManagerEstimate } from "@/lib/lead-pricing";

export type LeadData = {
  name: string;
  phone: string;
  city?: string;
  fenceType?: string;
  length?: string;
  height?: string;
  gateType?: string;
  wicket?: string;
  paymentMethod?: string;
  comment?: string;
  source: string;
};

const hasValue = (value?: string) => Boolean(value?.trim());
const valueOrEmpty = (value?: string) => value?.trim() ?? "";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeValue = (value?: string | number | null) =>
  escapeHtml(String(value ?? "").trim());

const SECTION_DIVIDER = "─────────────────";
const OWN_FUNDS = "Собственные средства";

export function formatLeadMessage(data: LeadData) {
  const submittedAt = new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Minsk",
  }).format(new Date());

  const lines = [
    "🔔 Новая заявка с masterzabor.by",
    "",
    "👤 КЛИЕНТ",
    `Имя: ${escapeValue(data.name)}`,
    `Телефон: ${escapeValue(data.phone)}`,
  ];

  if (hasValue(data.city)) {
    lines.push(`Населённый пункт: ${escapeValue(data.city)}`);
  }

  const fenceLines = [
    hasValue(data.fenceType) ? `Тип: ${escapeValue(data.fenceType)}` : null,
    hasValue(data.length) ? `Длина: ${escapeValue(data.length)}` : null,
    hasValue(data.height) ? `Высота: ${escapeValue(data.height)}` : null,
    hasValue(data.gateType) ? `Ворота: ${escapeValue(data.gateType)}` : null,
    hasValue(data.wicket) ? `Калитка: ${escapeValue(data.wicket)}` : null,
  ].filter((line): line is string => line !== null);

  if (fenceLines.length > 0) {
    lines.push("", SECTION_DIVIDER, "🏗 ЗАБОР", ...fenceLines);
  }

  if (hasValue(data.paymentMethod)) {
    const paymentMethod = valueOrEmpty(data.paymentMethod);
    const isOwnFunds = paymentMethod === OWN_FUNDS;

    lines.push(
      "",
      SECTION_DIVIDER,
      isOwnFunds ? "💵 ОПЛАТА" : "💳 ОПЛАТА",
      isOwnFunds
        ? `<b>${escapeValue(paymentMethod.toUpperCase())}</b>`
        : escapeValue(paymentMethod),
    );
  }

  if (hasValue(data.comment)) {
    lines.push(
      "",
      SECTION_DIVIDER,
      "💬 КОММЕНТАРИЙ КЛИЕНТА",
      escapeValue(data.comment),
    );
  }

  const estimate = calculateManagerEstimate(data);

  if (estimate.status === "calculated") {
    const gateLabel = data.gateType?.trim() || "не выбраны";
    const wicketLabel = data.wicket?.trim() || "не выбрана";
    const estimateHeight = estimate.heightFallbackUsed
      ? "высоту клиент не знает"
      : estimate.calculationHeight;

    lines.push(
      "",
      SECTION_DIVIDER,
      "💰 ОРИЕНТИР ДЛЯ МЕНЕДЖЕРА",
      `Забор: ${escapeValue(estimate.lengthMeters)} м (${escapeValue(data.fenceType)}, ${escapeValue(estimateHeight)}) × ${escapeValue(estimate.pricePerMeter)} BYN/м.п. = ${escapeValue(estimate.fenceSubtotal)} BYN`,
    );

    if (estimate.heightFallbackUsed) {
      lines.push(
        `Для расчёта принята высота ${escapeValue(estimate.calculationHeight)}`,
      );
    }

    lines.push(
      `Ворота: ${escapeValue(gateLabel)} — ${escapeValue(estimate.gatePrice)} BYN`,
      `Калитка: ${escapeValue(wicketLabel)} — ${escapeValue(estimate.wicketPrice)} BYN`,
      "",
      `<b>ИТОГО: ≈ ${escapeValue(estimate.total)} BYN</b>`,
    );
  }

  lines.push(
    "",
    SECTION_DIVIDER,
    `Источник: ${escapeValue(data.source)}`,
    submittedAt,
  );

  return lines.join("\n");
}

async function sendTelegramRequest({
  chatId,
  text,
  parseMode,
}: {
  chatId?: string;
  text: string;
  parseMode?: "HTML";
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const defaultChatId = process.env.TELEGRAM_CHAT_ID;
  const targetChatId = chatId ?? defaultChatId;

  if (!token || !targetChatId) {
    console.warn("Telegram env variables are not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: targetChatId,
          text,
          ...(parseMode ? { parse_mode: parseMode } : {}),
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        "Telegram sendMessage failed",
        response.status,
        errorText.slice(0, 500),
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram message", error);
    return false;
  }
}

export async function sendToTelegram(data: LeadData): Promise<boolean> {
  return sendTelegramRequest({
    text: formatLeadMessage(data),
    parseMode: "HTML",
  });
}

export async function sendTelegramText(text: string): Promise<boolean> {
  return sendTelegramRequest({ text });
}

export async function sendTelegramTextToChat(
  chatId: string,
  text: string,
): Promise<boolean> {
  return sendTelegramRequest({ chatId, text });
}

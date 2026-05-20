export type LeadData = {
  name: string;
  phone: string;
  city?: string;
  fenceType?: string;
  length?: string;
  height?: string;
  gateType?: string;
  wicket?: string;
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

const PRICE_PER_METER: Record<string, number> = {
  Профнастил: 120,
  Евроштакетник: 130,
  "Сетка-рабица": 50,
};

const GATE_PRICE: Record<string, number> = {
  Распашные: 1200,
  Откатные: 3000,
  "Не нужны": 0,
};

const WICKET_PRICE: Record<string, number> = {
  "Калитка с замком": 600,
  "Калитка без замка": 400,
  "Калитка не нужна": 0,
};

function parseLengthMeters(length?: string) {
  if (!length) {
    return null;
  }

  const normalized = length.replace(",", ".");
  const match = normalized.match(/\d+(\.\d+)?/);

  if (!match) {
    return null;
  }

  const numeric = Number(match[0]);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function formatLeadMessage(data: LeadData) {
  const submittedAt = new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Minsk",
  }).format(new Date());

  const lines = [
    "🔔 Новая заявка с сайта masterzabor.by!",
    "─────────────────",
    `👤 Имя: ${valueOrEmpty(data.name)}`,
    `📞 Телефон: ${valueOrEmpty(data.phone)}`,
  ];

  if (hasValue(data.city)) {
    lines.push(`📍 Населённый пункт: ${valueOrEmpty(data.city)}`);
  }
  if (hasValue(data.fenceType)) {
    lines.push(`🏗 Тип забора: ${valueOrEmpty(data.fenceType)}`);
  }
  if (hasValue(data.length)) {
    lines.push(`📏 Длина: ${valueOrEmpty(data.length)}`);
  }
  if (hasValue(data.height)) {
    lines.push(`📐 Высота: ${valueOrEmpty(data.height)}`);
  }
  if (hasValue(data.gateType)) {
    lines.push(`🚪 Ворота: ${valueOrEmpty(data.gateType)}`);
  }
  if (hasValue(data.wicket)) {
    lines.push(`🚶 Калитка: ${valueOrEmpty(data.wicket)}`);
  }
  if (hasValue(data.comment)) {
    lines.push(`💬 ${valueOrEmpty(data.comment)}`);
  }

  lines.push(
    "─────────────────",
    `📄 Страница: ${valueOrEmpty(data.source)}`,
    `⏰ ${submittedAt}`,
  );

  const lengthMeters = parseLengthMeters(data.length);
  const pricePerMeter = data.fenceType ? PRICE_PER_METER[data.fenceType] : undefined;

  if (lengthMeters && pricePerMeter) {
    const gatePrice = data.gateType ? (GATE_PRICE[data.gateType] ?? 0) : 0;
    const wicketPrice = data.wicket ? (WICKET_PRICE[data.wicket] ?? 0) : 0;
    const gateLabel = data.gateType?.trim() || "не выбраны";
    const wicketLabel = data.wicket?.trim() || "не выбрана";
    const subtotal = Math.round(lengthMeters * pricePerMeter);
    const total = subtotal + gatePrice + wicketPrice;

    lines.push(
      "─────────────────",
      "💰 Ориентир (для менеджера):",
      `   Забор: ${lengthMeters}м × ${pricePerMeter} BYN/м.п. = ${subtotal} BYN`,
      `   Ворота (${gateLabel}): +${gatePrice} BYN`,
      `   Калитка (${wicketLabel}): +${wicketPrice} BYN`,
      `   ≈ ИТОГО: ${total} BYN`,
    );
  }

  return lines
    .map(escapeHtml)
    .join("\n");
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

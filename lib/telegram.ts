export type LeadData = {
  name: string;
  phone: string;
  city?: string;
  fenceType?: string;
  length?: string;
  height?: string;
  gateType?: string;
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
  if (hasValue(data.comment)) {
    lines.push(`💬 ${valueOrEmpty(data.comment)}`);
  }

  lines.push(
    "─────────────────",
    `📄 Страница: ${valueOrEmpty(data.source)}`,
    `⏰ ${submittedAt}`,
  );

  return lines
    .map(escapeHtml)
    .join("\n");
}

export async function sendToTelegram(data: LeadData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
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
          chat_id: chatId,
          text: formatLeadMessage(data),
          parse_mode: "HTML",
        }),
      },
    );

    return response.ok;
  } catch (error) {
    console.error("Failed to send Telegram message", error);
    return false;
  }
}

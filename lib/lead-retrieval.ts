import type { StoredLead } from "@/lib/leads";
import { formatLeadMessage } from "@/lib/telegram";

export const NO_LEADS_MESSAGE = "За выбранный период заявок нет.";
export const LEAD_NOT_FOUND_MESSAGE =
  "Заявка с таким ID не найдена за последние 180 дней.";
export const TELEGRAM_MESSAGE_LIMIT = 4000;

export type OutgoingTelegramMessage = {
  text: string;
  parseMode?: "HTML";
};

export function formatStoredLeadMessage(lead: StoredLead) {
  return formatLeadMessage(lead, {
    id: lead.id,
    submittedAt: lead.time,
  });
}

function decodeTelegramHtml(text: string) {
  return text
    .replaceAll(/<\/?(?:b|code)>/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

export function splitPlainTelegramText(
  text: string,
  limit = TELEGRAM_MESSAGE_LIMIT,
) {
  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > limit) {
    const candidate = remaining.slice(0, limit + 1);
    const breakAt = Math.max(
      candidate.lastIndexOf("\n"),
      candidate.lastIndexOf(" "),
    );
    let splitAt = breakAt > 0 ? breakAt : limit;
    const previousCodeUnit = remaining.charCodeAt(splitAt - 1);
    const nextCodeUnit = remaining.charCodeAt(splitAt);
    if (
      previousCodeUnit >= 0xd800 &&
      previousCodeUnit <= 0xdbff &&
      nextCodeUnit >= 0xdc00 &&
      nextCodeUnit <= 0xdfff
    ) {
      splitAt -= 1;
    }
    const chunk = remaining.slice(0, splitAt).trim();
    if (chunk) {
      chunks.push(chunk);
    }
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}

export function createStoredLeadMessages(
  lead: StoredLead,
): OutgoingTelegramMessage[] {
  const html = formatStoredLeadMessage(lead);
  if (html.length <= TELEGRAM_MESSAGE_LIMIT) {
    return [{ text: html, parseMode: "HTML" }];
  }

  return splitPlainTelegramText(decodeTelegramHtml(html)).map((text) => ({
    text,
  }));
}

export function createDetailedLeadMessages(
  leads: StoredLead[],
  heading: string,
): OutgoingTelegramMessage[] {
  if (leads.length === 0) {
    return [{ text: NO_LEADS_MESSAGE }];
  }

  return [
    { text: heading },
    ...leads.flatMap((lead) => createStoredLeadMessages(lead)),
  ];
}

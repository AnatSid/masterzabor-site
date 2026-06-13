import { NextRequest, NextResponse } from "next/server";

import { appendLeadToStorage, updateLeadDeliveryStatus } from "@/lib/leads";
import { LeadData, sendToTelegram } from "@/lib/telegram";
import { isValidBelarusPhone, normalizeBelarusPhone } from "@/lib/phone";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, number[]>();

type LeadRequestBody = Partial<Record<keyof LeadData, unknown>>;

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recentRequests = (rateLimitStore.get(ip) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ip, recentRequests);
    return true;
  }

  rateLimitStore.set(ip, [...recentRequests, now]);
  return false;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateLead(body: LeadRequestBody) {
  const lead: LeadData = {
    name: readString(body.name),
    phone: normalizeBelarusPhone(readString(body.phone)),
    city: readString(body.city),
    fenceType: readString(body.fenceType),
    length: readString(body.length),
    height: readString(body.height),
    gateType: readString(body.gateType),
    wicket: readString(body.wicket),
    comment: readString(body.comment),
    source: readString(body.source),
  };

  if (!lead.name) {
    return { error: "Введите имя" };
  }

  if (!isValidBelarusPhone(lead.phone)) {
    return { error: "Введите белорусский номер телефона" };
  }

  if (!lead.source) {
    return { error: "Не указан источник заявки" };
  }

  return { lead };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Слишком много заявок. Попробуйте через минуту." },
      { status: 429 },
    );
  }

  let body: LeadRequestBody;

  try {
    body = (await request.json()) as LeadRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Некорректный JSON в запросе" },
      { status: 400 },
    );
  }

  const validation = validateLead(body);

  if ("error" in validation) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  let storedLead: Awaited<ReturnType<typeof appendLeadToStorage>>;

  try {
    storedLead = await appendLeadToStorage(validation.lead);
  } catch (error) {
    console.error("Failed to save lead to KV", error);
    return NextResponse.json(
      { error: "Не удалось сохранить заявку" },
      { status: 502 },
    );
  }

  const isSent = await sendToTelegram(validation.lead);

  if (!isSent) {
    await updateLeadDeliveryStatus({
      dateKey: storedLead.dateKey,
      id: storedLead.record.id,
      status: "telegram_failed",
    }).catch((error) => {
      console.error("Failed to mark lead Telegram failure", error);
    });

    return NextResponse.json({
      success: true,
      leadId: storedLead.record.id,
      deliveryStatus: "telegram_failed",
    });
  }

  await updateLeadDeliveryStatus({
    dateKey: storedLead.dateKey,
    id: storedLead.record.id,
    status: "telegram_sent",
  }).catch((error) => {
    console.error("Failed to mark lead Telegram success", error);
  });

  return NextResponse.json({
    success: true,
    leadId: storedLead.record.id,
    deliveryStatus: "telegram_sent",
  });
}

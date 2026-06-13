import { kv } from "@vercel/kv";

const MINSK_TIME_ZONE = "Europe/Minsk";
const EVENT_KEY_PREFIX = "analytics-events:v1:";

export const CONTACT_EVENT_TYPES = [
  "click_call",
  "click_telegram",
  "click_whatsapp",
  "click_viber",
] as const;

export const QUIZ_FUNNEL_EVENT_TYPES = [
  "quiz_started",
  "quiz_step_3_reached",
  "quiz_contact_step_reached",
] as const;

export type ContactEventType = (typeof CONTACT_EVENT_TYPES)[number];
export type QuizFunnelEventType = (typeof QUIZ_FUNNEL_EVENT_TYPES)[number];
export type ConversionEventType = ContactEventType | QuizFunnelEventType;

export type ConversionEventInput = {
  type: ConversionEventType;
  pagePath?: string;
  source?: string;
  location?: string;
};

export type ConversionEventSummary = {
  contactClicks: {
    call: number;
    telegram: number;
    whatsapp: number;
    viber: number;
    total: number;
  };
  quizFunnel: {
    started: number;
    step3Reached: number;
    contactStepReached: number;
  };
};

const emptySummary = (): ConversionEventSummary => ({
  contactClicks: {
    call: 0,
    telegram: 0,
    whatsapp: 0,
    viber: 0,
    total: 0,
  },
  quizFunnel: {
    started: 0,
    step3Reached: 0,
    contactStepReached: 0,
  },
});

function dateToMinskKey(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: MINSK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

function getEventKeyByDateKey(dateKey: string) {
  return `${EVENT_KEY_PREFIX}${dateKey}`;
}

function getDateKeyFromStorageKey(key: string) {
  return key.slice(key.lastIndexOf(":") + 1);
}

function sanitizeFieldValue(value?: string) {
  const normalized = value?.trim().replaceAll(":", "_").slice(0, 120);
  return normalized || "unknown";
}

export function isConversionEventType(
  value: unknown,
): value is ConversionEventType {
  return (
    typeof value === "string" &&
    ([...CONTACT_EVENT_TYPES, ...QUIZ_FUNNEL_EVENT_TYPES] as string[]).includes(
      value,
    )
  );
}

export async function recordConversionEvent(event: ConversionEventInput) {
  const dateKey = dateToMinskKey(new Date());
  const key = getEventKeyByDateKey(dateKey);
  const pagePath = sanitizeFieldValue(event.pagePath);
  const source = sanitizeFieldValue(event.source);
  const location = sanitizeFieldValue(event.location);

  await kv
    .pipeline()
    .hincrby(key, "total", 1)
    .hincrby(key, `type:${event.type}`, 1)
    .hincrby(key, `page:${pagePath}`, 1)
    .hincrby(key, `source:${source}`, 1)
    .hincrby(key, `location:${location}`, 1)
    .hincrby(key, `type_location:${event.type}:${location}`, 1)
    .exec();
}

function numberFromHash(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value) || 0;
  }

  return 0;
}

function addSummary(
  summary: ConversionEventSummary,
  hash: Record<string, unknown> | null,
) {
  if (!hash) {
    return summary;
  }

  summary.contactClicks.call += numberFromHash(hash["type:click_call"]);
  summary.contactClicks.telegram += numberFromHash(hash["type:click_telegram"]);
  summary.contactClicks.whatsapp += numberFromHash(hash["type:click_whatsapp"]);
  summary.contactClicks.viber += numberFromHash(hash["type:click_viber"]);
  summary.quizFunnel.started += numberFromHash(hash["type:quiz_started"]);
  summary.quizFunnel.step3Reached += numberFromHash(
    hash["type:quiz_step_3_reached"],
  );
  summary.quizFunnel.contactStepReached += numberFromHash(
    hash["type:quiz_contact_step_reached"],
  );

  return summary;
}

export async function getConversionEventSummaryByKeys(keys: string[]) {
  const summary = emptySummary();
  const hashes = await Promise.all(
    keys.map((key) =>
      kv.hgetall<Record<string, unknown>>(
        getEventKeyByDateKey(getDateKeyFromStorageKey(key)),
      ),
    ),
  );

  for (const hash of hashes) {
    addSummary(summary, hash);
  }

  summary.contactClicks.total =
    summary.contactClicks.call +
    summary.contactClicks.telegram +
    summary.contactClicks.whatsapp +
    summary.contactClicks.viber;

  return summary;
}

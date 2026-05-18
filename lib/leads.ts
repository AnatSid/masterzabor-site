import { kv } from "@vercel/kv";
import { LeadData } from "@/lib/telegram";

const MINSK_TIME_ZONE = "Europe/Minsk";
const LEAD_KEY_PREFIX = "leads:";

export type StoredLead = {
  name: string;
  phone: string;
  city: string;
  source: string;
  fenceType: string;
  time: string;
};

function dateToMinskKey(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: MINSK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

export function getLeadKeyByDate(date: Date) {
  return `${LEAD_KEY_PREFIX}${dateToMinskKey(date)}`;
}

export function getTodayLeadKey() {
  return getLeadKeyByDate(new Date());
}

function normalizeStoredLead(lead: LeadData): StoredLead {
  return {
    name: lead.name,
    phone: lead.phone,
    city: lead.city?.trim() || "Не указан",
    source: lead.source,
    fenceType: lead.fenceType?.trim() || "Не указан",
    time: new Date().toISOString(),
  };
}

export async function appendLeadToStorage(lead: LeadData) {
  const key = getTodayLeadKey();
  const record = normalizeStoredLead(lead);
  const current = (await kv.get<StoredLead[]>(key)) ?? [];
  await kv.set(key, [...current, record]);

  return { key, record };
}

export async function getLeadsByKeys(keys: string[]) {
  const entries = await Promise.all(
    keys.map(async (key) => ({
      key,
      leads: (await kv.get<StoredLead[]>(key)) ?? [],
    })),
  );

  return entries;
}

export function getRangeKeys(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const day = new Date();
    day.setUTCDate(day.getUTCDate() - index);
    return getLeadKeyByDate(day);
  }).reverse();
}

export function getMonthToDateKeys() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: MINSK_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(now);
  const year = Number(parts.find((item) => item.type === "year")?.value ?? "0");
  const month = Number(parts.find((item) => item.type === "month")?.value ?? "1");
  const day = Number(parts.find((item) => item.type === "day")?.value ?? "1");

  return Array.from({ length: day }, (_, index) =>
    getLeadKeyByDate(new Date(Date.UTC(year, month - 1, index + 1, 12))),
  );
}

export function aggregateLeads(leads: StoredLead[]) {
  const bySource: Record<string, number> = {};
  const byCity: Record<string, number> = {};
  const byDay: Record<string, number> = {};

  for (const lead of leads) {
    bySource[lead.source] = (bySource[lead.source] ?? 0) + 1;
    byCity[lead.city] = (byCity[lead.city] ?? 0) + 1;
    const dayKey = lead.time.slice(0, 10);
    byDay[dayKey] = (byDay[dayKey] ?? 0) + 1;
  }

  return {
    totalLeads: leads.length,
    bySource,
    byCity,
    byDay,
  };
}

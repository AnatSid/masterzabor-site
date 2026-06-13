import { kv } from "@vercel/kv";
import { cities } from "@/content/cities";
import { LeadData } from "@/lib/telegram";

const MINSK_TIME_ZONE = "Europe/Minsk";
const LEAD_KEY_PREFIX = "leads:";
const LEAD_LIST_KEY_PREFIX = "leads:v2:";
const LEAD_STATUS_KEY_PREFIX = "lead-statuses:";

export type LeadDeliveryStatus =
  | "legacy"
  | "pending_delivery"
  | "telegram_sent"
  | "telegram_failed";

export type StoredLead = {
  id: string;
  name: string;
  phone: string;
  city: string;
  source: string;
  fenceType: string;
  time: string;
  status: LeadDeliveryStatus;
};

const cityLabelBySlug = new Map(cities.map((city) => [city.slug, city.name]));

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

function getLeadListKeyByDateKey(dateKey: string) {
  return `${LEAD_LIST_KEY_PREFIX}${dateKey}`;
}

function getLeadStatusKeyByDateKey(dateKey: string) {
  return `${LEAD_STATUS_KEY_PREFIX}${dateKey}`;
}

function getDateKeyFromStorageKey(key: string) {
  if (key.startsWith(LEAD_LIST_KEY_PREFIX)) {
    return key.slice(LEAD_LIST_KEY_PREFIX.length);
  }

  if (key.startsWith(LEAD_KEY_PREFIX)) {
    return key.slice(LEAD_KEY_PREFIX.length);
  }

  return key;
}

export function getTodayLeadKey() {
  return getLeadKeyByDate(new Date());
}

function normalizeStoredLead(lead: LeadData): StoredLead {
  return {
    id: crypto.randomUUID(),
    name: lead.name,
    phone: lead.phone,
    city: lead.city?.trim() || "Не указан",
    source: lead.source,
    fenceType: lead.fenceType?.trim() || "Не указан",
    time: new Date().toISOString(),
    status: "pending_delivery",
  };
}

export async function appendLeadToStorage(lead: LeadData) {
  const dateKey = dateToMinskKey(new Date());
  const key = getLeadListKeyByDateKey(dateKey);
  const statusKey = getLeadStatusKeyByDateKey(dateKey);
  const record = normalizeStoredLead(lead);
  await kv.pipeline().rpush(key, record).hset(statusKey, {
    [record.id]: record.status,
  }).exec();

  return { dateKey, key, record, statusKey };
}

export async function updateLeadDeliveryStatus({
  dateKey,
  id,
  status,
}: {
  dateKey: string;
  id: string;
  status: Exclude<LeadDeliveryStatus, "legacy" | "pending_delivery">;
}) {
  await kv.hset(getLeadStatusKeyByDateKey(dateKey), { [id]: status });
}

function normalizeLegacyLead(lead: Partial<StoredLead> & Partial<LeadData>): StoredLead {
  return {
    id: lead.id || `legacy-${lead.time || crypto.randomUUID()}`,
    name: lead.name || "",
    phone: lead.phone || "",
    city: lead.city?.trim() || "Не указан",
    source: lead.source || "unknown",
    fenceType: lead.fenceType?.trim() || "Не указан",
    time: lead.time || new Date().toISOString(),
    status: lead.status || "legacy",
  };
}

export async function getLeadsByKeys(keys: string[]) {
  const entries = await Promise.all(
    keys.map(async (key) => {
      const dateKey = getDateKeyFromStorageKey(key);
      const legacyKey = `${LEAD_KEY_PREFIX}${dateKey}`;
      const listKey = getLeadListKeyByDateKey(dateKey);
      const statusKey = getLeadStatusKeyByDateKey(dateKey);
      const [legacyLeads, currentLeads, statusMap] = await Promise.all([
        kv.get<StoredLead[]>(legacyKey),
        kv.lrange<StoredLead>(listKey, 0, -1),
        kv.hgetall<Record<string, LeadDeliveryStatus>>(statusKey),
      ]);

      const legacy = (legacyLeads ?? []).map(normalizeLegacyLead);
      const current = currentLeads.map((lead) => ({
        ...normalizeLegacyLead(lead),
        status: statusMap?.[lead.id] ?? lead.status ?? "pending_delivery",
      }));

      return {
        key,
        leads: [...legacy, ...current],
      };
    }),
  );

  return entries;
}

function cityFromSource(source: string) {
  if (!source.startsWith("city-")) {
    return null;
  }

  const slug = source.slice("city-".length).trim();
  if (!slug) {
    return null;
  }

  return cityLabelBySlug.get(slug) ?? slug;
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
    const normalizedCity = cityFromSource(lead.source);
    if (normalizedCity) {
      byCity[normalizedCity] = (byCity[normalizedCity] ?? 0) + 1;
    }
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

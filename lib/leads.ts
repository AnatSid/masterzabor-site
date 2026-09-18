import { kv } from "@vercel/kv";
import { cities } from "@/content/cities";
import { DATA_RETENTION_SECONDS } from "@/lib/data-retention";
import type { LeadData } from "@/lib/telegram";

const MINSK_TIME_ZONE = "Europe/Minsk";
const LEAD_LIST_KEY_PREFIX = "leads:v2:";
const LEAD_STATUS_KEY_PREFIX = "lead-statuses:";

export type LeadDeliveryStatus =
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
  length: string;
  height: string;
  gateType: string;
  wicket: string;
  paymentMethod: string;
  comment: string;
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
  return getLeadListKeyByDateKey(dateToMinskKey(date));
}

function getLeadListKeyByDateKey(dateKey: string) {
  return `${LEAD_LIST_KEY_PREFIX}${dateKey}`;
}

function getLeadStatusKeyByDateKey(dateKey: string) {
  return `${LEAD_STATUS_KEY_PREFIX}${dateKey}`;
}

export function getDateKeyFromStorageKey(key: string) {
  if (key.startsWith(LEAD_LIST_KEY_PREFIX)) {
    return key.slice(LEAD_LIST_KEY_PREFIX.length);
  }

  return key;
}

export function getTodayLeadKey() {
  return getLeadKeyByDate(new Date());
}

function normalizeStoredLead(
  lead: LeadData,
  id = crypto.randomUUID(),
  submittedAt = new Date(),
): StoredLead {
  return {
    id,
    name: lead.name,
    phone: lead.phone,
    city: lead.city?.trim() || "Не указан",
    source: lead.source,
    fenceType: lead.fenceType?.trim() || "Не указан",
    length: lead.length?.trim() || "",
    height: lead.height?.trim() || "",
    gateType: lead.gateType?.trim() || "",
    wicket: lead.wicket?.trim() || "",
    paymentMethod: lead.paymentMethod?.trim() || "",
    comment: lead.comment?.trim() || "",
    time: submittedAt.toISOString(),
    status: "pending_delivery",
  };
}

type LeadStoragePipeline = {
  rpush(key: string, value: StoredLead): LeadStoragePipeline;
  hset(
    key: string,
    values: Record<string, LeadDeliveryStatus>,
  ): LeadStoragePipeline;
  expire(key: string, seconds: number): LeadStoragePipeline;
  exec(): Promise<unknown>;
};

export type LeadWriteClient = {
  pipeline(): LeadStoragePipeline;
};

export type LeadStatusWriteClient = {
  hset(key: string, values: Record<string, LeadDeliveryStatus>): Promise<unknown>;
};

export type LeadReadClient = {
  lrange<T>(key: string, start: number, end: number): Promise<T[]>;
  hgetall<T>(key: string): Promise<T | null>;
};

export async function appendLeadToStorage(
  lead: LeadData,
  options: {
    client?: LeadWriteClient;
    id?: string;
    submittedAt?: Date;
  } = {},
) {
  const client = options.client ?? (kv as LeadWriteClient);
  const submittedAt = options.submittedAt ?? new Date();
  const dateKey = dateToMinskKey(submittedAt);
  const key = getLeadListKeyByDateKey(dateKey);
  const statusKey = getLeadStatusKeyByDateKey(dateKey);
  const record = normalizeStoredLead(lead, options.id, submittedAt);
  await client
    .pipeline()
    .rpush(key, record)
    .hset(statusKey, { [record.id]: record.status })
    .expire(key, DATA_RETENTION_SECONDS)
    .expire(statusKey, DATA_RETENTION_SECONDS)
    .exec();

  return { dateKey, key, record, statusKey };
}

export async function updateLeadDeliveryStatus({
  dateKey,
  id,
  status,
  client,
}: {
  dateKey: string;
  id: string;
  status: Exclude<LeadDeliveryStatus, "pending_delivery">;
  client?: LeadStatusWriteClient;
}) {
  await (client ?? (kv as LeadStatusWriteClient)).hset(
    getLeadStatusKeyByDateKey(dateKey),
    { [id]: status },
  );
}

export async function getLeadsByKeys(
  keys: string[],
  client: LeadReadClient = kv as LeadReadClient,
) {
  const entries = await Promise.all(
    keys.map(async (key) => {
      const dateKey = getDateKeyFromStorageKey(key);
      const listKey = getLeadListKeyByDateKey(dateKey);
      const statusKey = getLeadStatusKeyByDateKey(dateKey);
      const [currentLeads, statusMap] = await Promise.all([
        client.lrange<StoredLead>(listKey, 0, -1),
        client.hgetall<Record<string, LeadDeliveryStatus>>(statusKey),
      ]);

      const current = currentLeads.map((lead) => ({
        ...lead,
        status: statusMap?.[lead.id] ?? lead.status,
      }));

      return {
        key,
        leads: current,
      };
    }),
  );

  return entries;
}

export async function getLeadsForDays(
  days: number,
  client: LeadReadClient = kv as LeadReadClient,
) {
  const entries = await getLeadsByKeys(getRangeKeys(days), client);
  return entries
    .flatMap((entry) => entry.leads)
    .sort((a, b) => b.time.localeCompare(a.time));
}

export async function findLeadById(
  id: string,
  client: LeadReadClient = kv as LeadReadClient,
) {
  const keys = getRangeKeys(180).reverse();
  const batchSize = 30;

  for (let index = 0; index < keys.length; index += batchSize) {
    const entries = await getLeadsByKeys(
      keys.slice(index, index + batchSize),
      client,
    );
    const lead = entries
      .flatMap((entry) => entry.leads)
      .find((item) => item.id === id);
    if (lead) {
      return lead;
    }
  }

  return null;
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

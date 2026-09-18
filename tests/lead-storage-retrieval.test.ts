import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { pathToFileURL } from "node:url";

const projectRootUrl = pathToFileURL(`${process.cwd()}\\`);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(
        new URL(`${specifier.slice(2)}.ts`, projectRootUrl).href,
        context,
      );
    }

    return nextResolve(specifier, context);
  },
});

// @ts-expect-error Node's type-stripping loader requires the explicit extension.
const leadsModule = await import("../lib/leads.ts");
// @ts-expect-error Node's type-stripping loader requires the explicit extension.
const eventsModule = await import("../lib/conversion-events.ts");
// @ts-expect-error Node's type-stripping loader requires the explicit extension.
const commandsModule = await import("../lib/telegram-bot-commands.ts");
// @ts-expect-error Node's type-stripping loader requires the explicit extension.
const retrievalModule = await import("../lib/lead-retrieval.ts");
// @ts-expect-error Node's type-stripping loader requires the explicit extension.
const retentionModule = await import("../lib/data-retention.ts");

const {
  appendLeadToStorage,
  findLeadById,
  getLeadKeyByDate,
  getLeadsByKeys,
  getLeadsForDays,
} = leadsModule;
const { recordConversionEvent } = eventsModule;
const {
  normalizeTelegramCommand,
  resolveLeadId,
  resolveLeadsPeriod,
  resolveStatsPeriod,
} = commandsModule;
const {
  createDetailedLeadMessages,
  createStoredLeadMessages,
  formatStoredLeadMessage,
  NO_LEADS_MESSAGE,
  TELEGRAM_MESSAGE_LIMIT,
} = retrievalModule;
const { DATA_RETENTION_SECONDS } = retentionModule;

const baseStoredLead = {
  id: "58e08bf8-64d6-4b50-a6f0-7fefae80319f",
  name: "Олег",
  phone: "+375298257195",
  city: "Минск",
  source: "home-quiz",
  fenceType: "Профнастил",
  length: "60 м",
  height: "1.7 м",
  gateType: "Распашные",
  wicket: "Да, нужна",
  paymentMethod: "Рассрочка или кредит",
  comment: "",
  time: "2026-09-18T11:32:00.000Z",
  status: "pending_delivery" as const,
};

function createPipelineRecorder() {
  const commands: Array<{ name: string; args: unknown[] }> = [];
  const pipeline = {
    rpush(...args: unknown[]) {
      commands.push({ name: "rpush", args });
      return pipeline;
    },
    hset(...args: unknown[]) {
      commands.push({ name: "hset", args });
      return pipeline;
    },
    hincrby(...args: unknown[]) {
      commands.push({ name: "hincrby", args });
      return pipeline;
    },
    expire(...args: unknown[]) {
      commands.push({ name: "expire", args });
      return pipeline;
    },
    async exec() {
      commands.push({ name: "exec", args: [] });
      return [];
    },
  };

  return { commands, pipeline };
}

test("lead storage writes only the canonical list and applies both TTLs", async () => {
  const { commands, pipeline } = createPipelineRecorder();
  const client = { pipeline: () => pipeline };
  const id = baseStoredLead.id;
  const submittedAt = new Date(baseStoredLead.time);

  const result = await appendLeadToStorage(
    {
      name: baseStoredLead.name,
      phone: baseStoredLead.phone,
      source: baseStoredLead.source,
    },
    { client, id, submittedAt },
  );

  assert.equal(result.key, "leads:v2:2026-09-18");
  assert.equal(result.statusKey, "lead-statuses:2026-09-18");
  assert.equal(result.record.id, id);
  assert.equal(result.record.time, baseStoredLead.time);
  assert.match(formatStoredLeadMessage(result.record), new RegExp(id));
  assert.deepEqual(
    commands
      .filter((command) => command.name === "expire")
      .map((command) => command.args),
    [
      ["leads:v2:2026-09-18", DATA_RETENTION_SECONDS],
      ["lead-statuses:2026-09-18", DATA_RETENTION_SECONDS],
    ],
  );
  assert.equal(
    commands.some((command) =>
      String(command.args[0]).startsWith("leads:2026"),
    ),
    false,
  );
});

test("canonical reads never request the legacy leads:{date} key", async () => {
  const calls: string[] = [];
  const client = {
    pipeline() {
      throw new Error("not used");
    },
    async lrange<T>(key: string) {
      calls.push(key);
      return [baseStoredLead] as T[];
    },
    async hgetall<T>(key: string) {
      calls.push(key);
      return { [baseStoredLead.id]: "telegram_sent" } as T;
    },
  };

  const result = await getLeadsByKeys(["leads:v2:2026-09-18"], client);

  assert.deepEqual(calls.sort(), [
    "lead-statuses:2026-09-18",
    "leads:v2:2026-09-18",
  ]);
  assert.equal(result[0].leads[0].status, "telegram_sent");
  assert.equal("get" in client, false);
});

test("analytics daily hash receives the same 180-day TTL", async () => {
  const { commands, pipeline } = createPipelineRecorder();
  await recordConversionEvent(
    { type: "quiz_started", source: "home-quiz" },
    { pipeline: () => pipeline },
  );

  const expires = commands.filter((command) => command.name === "expire");
  assert.equal(expires.length, 1);
  assert.match(
    String(expires[0].args[0]),
    /^analytics-events:v1:\d{4}-\d{2}-\d{2}$/,
  );
  assert.equal(expires[0].args[1], DATA_RETENTION_SECONDS);
});

test("stats commands remain aggregate and detailed lead periods resolve separately", () => {
  assert.equal(resolveStatsPeriod("/stats_today", ""), "today");
  assert.equal(resolveStatsPeriod("/stats_week", ""), "week");
  assert.equal(resolveStatsPeriod("/stats_month", ""), "month");
  assert.equal(resolveLeadsPeriod("/leads_today"), "today");
  assert.equal(resolveLeadsPeriod("/leads_week"), "week");
  assert.equal(resolveLeadsPeriod("/leads_month"), "month");
  assert.equal(resolveStatsPeriod("/leads_today", ""), null);
});

test("/lead command keeps and resolves its supplied ID", () => {
  const parsed = normalizeTelegramCommand(
    `/lead@masterzabor_bot ${baseStoredLead.id}`,
  );
  assert.equal(parsed.command, "/lead");
  assert.equal(resolveLeadId(parsed.command, parsed.arg), baseStoredLead.id);
  assert.equal(resolveLeadId("/lead", "  "), null);
});

test("historical lead detail keeps original data, estimate, ID, and time", () => {
  const message = formatStoredLeadMessage(baseStoredLead);
  assert.match(
    message,
    /ID заявки: <code>58e08bf8-64d6-4b50-a6f0-7fefae80319f<\/code>/,
  );
  assert.match(message, /Имя: Олег/);
  assert.match(message, /<b>ИТОГО: ≈ 10700 BYN<\/b>/);
  assert.match(message, /18 сент\. 2026 г\., 14:32/);
  assert.doesNotMatch(message, /КОММЕНТАРИЙ КЛИЕНТА/);
});

test("lead lookup finds the canonical record inside the retention window", async () => {
  const lookupLead = { ...baseStoredLead, time: new Date().toISOString() };
  const targetKey = getLeadKeyByDate(new Date(lookupLead.time));
  const client = {
    pipeline() {
      throw new Error("not used");
    },
    async lrange<T>(key: string) {
      return (key === targetKey ? [lookupLead] : []) as T[];
    },
    async hgetall<T>() {
      return null as T | null;
    },
  };

  const result = await findLeadById(baseStoredLead.id, client);
  assert.equal(result?.id, baseStoredLead.id);
});

test("period retrieval orders canonical leads newest-first", async () => {
  const older = {
    ...baseStoredLead,
    id: "older",
    time: "2026-09-18T10:00:00.000Z",
  };
  const newer = {
    ...baseStoredLead,
    id: "newer",
    time: "2026-09-18T12:00:00.000Z",
  };
  const client = {
    async lrange<T>() {
      return [older, newer] as T[];
    },
    async hgetall<T>() {
      return null as T | null;
    },
  };

  const result = await getLeadsForDays(1, client);
  assert.deepEqual(result.map((lead: { id: string }) => lead.id), [
    "newer",
    "older",
  ]);
});

test("empty detailed period produces one short no-leads response", () => {
  assert.deepEqual(createDetailedLeadMessages([], "unused"), [
    { text: NO_LEADS_MESSAGE },
  ]);
});

test("detailed results are separate messages and oversized leads are safe chunks", () => {
  const messages = createDetailedLeadMessages(
    [baseStoredLead, { ...baseStoredLead, id: "second" }],
    "Заявки: 2",
  );
  assert.equal(messages.length, 3);
  assert.equal(messages[0].text, "Заявки: 2");
  assert.equal(messages[1].parseMode, "HTML");

  const chunks = createStoredLeadMessages({
    ...baseStoredLead,
    comment: "слово ".repeat(1200),
  });
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk) => chunk.text.length <= TELEGRAM_MESSAGE_LIMIT));
  assert.ok(chunks.every((chunk) => chunk.text.length > 0));
  assert.ok(chunks.every((chunk) => chunk.parseMode === undefined));
});

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TELEGRAM_WEBHOOK_URL } from "../lib/constants";
import { TELEGRAM_BOT_COMMANDS } from "../lib/telegram-bot-commands";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq < 0) continue;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!token || !secret) {
  console.error("TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET required in .env.local");
  process.exit(1);
}

const botToken = token;
const webhookSecret = secret;

async function main() {
  const setWebhookUrl = new URL(`https://api.telegram.org/bot${botToken}/setWebhook`);
  setWebhookUrl.searchParams.set("url", TELEGRAM_WEBHOOK_URL);
  setWebhookUrl.searchParams.set("secret_token", webhookSecret);

  const setWebhookResponse = await fetch(setWebhookUrl);
  const setWebhookPayload = await setWebhookResponse.json();
  console.log("setWebhook:", JSON.stringify(setWebhookPayload, null, 2));

  const setCommandsResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/setMyCommands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commands: TELEGRAM_BOT_COMMANDS }),
    },
  );
  const setCommandsPayload = await setCommandsResponse.json();
  console.log("setMyCommands:", JSON.stringify(setCommandsPayload, null, 2));

  const getCommandsResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/getMyCommands`,
  );
  const getCommandsPayload = await getCommandsResponse.json();
  console.log("getMyCommands:", JSON.stringify(getCommandsPayload, null, 2));

  const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
  const infoPayload = await infoResponse.json();
  console.log("getWebhookInfo:", JSON.stringify(infoPayload, null, 2));

  if (!setWebhookPayload.ok || !setCommandsPayload.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

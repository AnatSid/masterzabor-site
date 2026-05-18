import { NextRequest, NextResponse } from "next/server";
import {
  getLeadsByKeys,
  getMonthToDateKeys,
  getTodayLeadKey,
  type StoredLead,
} from "@/lib/leads";
import { sendTelegramText } from "@/lib/telegram";

export const runtime = "nodejs";

function getTopEntry(values: Record<string, number>) {
  return Object.entries(values).sort((a, b) => b[1] - a[1])[0];
}

function countBy<T extends keyof StoredLead>(leads: StoredLead[], field: T) {
  return leads.reduce<Record<string, number>>((acc, item) => {
    const key = item[field] || "Не указан";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function formatReportDate() {
  return new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "long",
    timeZone: "Europe/Minsk",
  }).format(new Date());
}

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return "";
  }
  return header.slice("Bearer ".length).trim();
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const requestToken = getBearerToken(request);
    if (requestToken !== cronSecret) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 401 });
    }
  }

  const todayLeads = await getLeadsByKeys([getTodayLeadKey()]);
  const todayItems = todayLeads.flatMap((entry) => entry.leads);
  const monthLeads = await getLeadsByKeys(getMonthToDateKeys());
  const monthItems = monthLeads.flatMap((entry) => entry.leads);

  const topSource = getTopEntry(countBy(todayItems, "source"));
  const topCity = getTopEntry(countBy(todayItems, "city"));
  const reportText = [
    `📊 Сводка за ${formatReportDate()}`,
    "",
    `Заявок за день: ${todayItems.length}`,
    `Топ страница: ${topSource ? `${topSource[0]} (${topSource[1]})` : "—"}`,
    `Топ город: ${topCity ? `${topCity[0]} (${topCity[1]})` : "—"}`,
    `Итого за месяц: ${monthItems.length}`,
  ].join("\n");

  const sent = await sendTelegramText(reportText);

  if (!sent) {
    return NextResponse.json(
      { error: "Не удалось отправить ежедневную сводку в Telegram" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    today: todayItems.length,
    month: monthItems.length,
  });
}

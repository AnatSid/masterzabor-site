import { NextRequest, NextResponse } from "next/server";
import { getTrafficReportText } from "@/lib/analytics/reporting";
import { formatTrafficReportTitle } from "@/lib/telegram-period";
import { sendTelegramText } from "@/lib/telegram";

export const runtime = "nodejs";

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

  let reportText = "";
  try {
    const report = await getTrafficReportText("today");
    reportText = report.text;
  } catch (error) {
    console.error("Analytics report generation failed", error);
    reportText = [
      formatTrafficReportTitle("today"),
      "",
      "⚠️ Не удалось получить данные аналитики",
    ].join("\n");
  }

  const sent = await sendTelegramText(reportText);

  if (!sent) {
    return NextResponse.json(
      { error: "Не удалось отправить analytics-report в Telegram" },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getTrafficReportText } from "@/lib/analytics/reporting";
import { validateBearerSecret } from "@/lib/request-auth";
import { formatTrafficReportTitle } from "@/lib/telegram-period";
import { sendTelegramText } from "@/lib/telegram";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = validateBearerSecret(request, "CRON_SECRET");
  if (authError) {
    return authError;
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

import { NextRequest, NextResponse } from "next/server";
import { getDailyReportSnapshot } from "@/lib/reporting";
import { validateBearerSecret } from "@/lib/request-auth";
import { sendTelegramText } from "@/lib/telegram";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = validateBearerSecret(request, "CRON_SECRET");
  if (authError) {
    return authError;
  }

  const snapshot = await getDailyReportSnapshot();

  const sent = await sendTelegramText(snapshot.text);

  if (!sent) {
    return NextResponse.json(
      { error: "Не удалось отправить ежедневную сводку в Telegram" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    today: snapshot.today,
    month: snapshot.month,
  });
}

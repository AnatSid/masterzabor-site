import { NextRequest, NextResponse } from "next/server";
import { getDailyReportSnapshot } from "@/lib/reporting";
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

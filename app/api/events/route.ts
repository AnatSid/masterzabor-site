import { NextRequest, NextResponse } from "next/server";
import {
  isConversionEventType,
  recordConversionEvent,
} from "@/lib/conversion-events";

export const runtime = "nodejs";

function readString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const event = payload as Record<string, unknown>;
  const type = event.type;

  if (!isConversionEventType(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  try {
    await recordConversionEvent({
      type,
      pagePath: readString(event.pagePath),
      source: readString(event.source),
      location: readString(event.location),
    });
  } catch (error) {
    console.error("[events] failed to record conversion event", error);
    return NextResponse.json({ success: false }, { status: 202 });
  }

  return NextResponse.json({ success: true });
}

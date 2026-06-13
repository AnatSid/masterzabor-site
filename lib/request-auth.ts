import { NextRequest, NextResponse } from "next/server";

export function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return "";
  }

  return header.slice("Bearer ".length).trim();
}

export function isVercelProduction() {
  return process.env.VERCEL_ENV === "production";
}

export function validateBearerSecret(
  request: NextRequest,
  envName: "CRON_SECRET" | "STATS_API_TOKEN",
) {
  const configuredToken = process.env[envName];

  if (!configuredToken) {
    if (isVercelProduction()) {
      return NextResponse.json(
        { error: `${envName} не настроен` },
        { status: 500 },
      );
    }

    return null;
  }

  const requestToken = getBearerToken(request);
  if (requestToken !== configuredToken) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 401 });
  }

  return null;
}

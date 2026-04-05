import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/constants";
import { fetchBackendJson } from "@/lib/backend-fetch";

/** Server-side login: exchanges credentials for a JWT and stores it in an HTTP-only cookie. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  const result = await fetchBackendJson("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }

  if (result.status >= 400) {
    return NextResponse.json(result.data, { status: result.status });
  }

  const data = result.data as Record<string, unknown>;
  const token = typeof data.access_token === "string" ? data.access_token : null;
  if (!token) {
    return NextResponse.json({ detail: "No access token returned from API" }, { status: 502 });
  }

  const out = NextResponse.json({ ok: true });
  const maxAge = 60 * 60;
  out.cookies.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return out;
}

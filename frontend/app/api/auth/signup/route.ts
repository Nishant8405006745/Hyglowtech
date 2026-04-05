import { NextRequest, NextResponse } from "next/server";

import { fetchBackendJson } from "@/lib/backend-fetch";

/** Proxies signup to FastAPI (public registration → default User role). */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  const result = await fetchBackendJson("/api/v1/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    return NextResponse.json(result.data, { status: result.status });
  }
  return NextResponse.json(result.data, { status: result.status });
}

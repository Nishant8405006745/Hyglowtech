import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  const base = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
  const url = `${base}/api/v1/auth/reset-password`;

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 15_000);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ac.signal,
    });
  } catch {
    clearTimeout(t);
    return NextResponse.json(
      {
        detail:
          "Cannot reach the Hyglow API. Start the backend (uvicorn) and set BACKEND_URL in frontend/.env.local.",
      },
      { status: 502 },
    );
  }
  clearTimeout(t);

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const text = await res.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { detail: text.slice(0, 200) || "Unexpected response from API" };
    }
  }
  return NextResponse.json(data, { status: res.status });
}

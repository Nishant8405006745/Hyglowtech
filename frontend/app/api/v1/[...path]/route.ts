import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/constants";

const backend = () => (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

type Ctx = { params: Promise<{ path: string[] }> };

async function forward(request: NextRequest, ctx: Ctx, method: string) {
  const { path: segments } = await ctx.params;
  const path = segments.join("/");
  const src = new URL(request.url);
  const targetUrl = `${backend()}/api/v1/${path}${src.search}`;

  const jar = await cookies();
  const token = jar.get(ACCESS_TOKEN_COOKIE)?.value;

  const headers: Record<string, string> = {};
  const ct = request.headers.get("content-type");
  if (ct) headers["Content-Type"] = ct;
  if (token) headers.Authorization = `Bearer ${token}`;

  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.text() : undefined;

  let res: Response;
  try {
    res = await fetch(targetUrl, {
      method,
      headers,
      body: body && body.length > 0 ? body : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        detail:
          "Cannot reach the Hyglow API. Start the backend with uvicorn (port 8000) and set BACKEND_URL in frontend/.env.local.",
      },
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  const outHeaders = new Headers();
  const outCt = res.headers.get("content-type");
  if (outCt) outHeaders.set("content-type", outCt);

  const buf = await res.arrayBuffer();
  return new NextResponse(buf, { status: res.status, headers: outHeaders });
}

export async function GET(request: NextRequest, ctx: Ctx) {
  return forward(request, ctx, "GET");
}

export async function POST(request: NextRequest, ctx: Ctx) {
  return forward(request, ctx, "POST");
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  return forward(request, ctx, "PATCH");
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  return forward(request, ctx, "PUT");
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  return forward(request, ctx, "DELETE");
}

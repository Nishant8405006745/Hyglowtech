/** Server-side fetch to FastAPI with timeout and JSON-safe body parsing. */

const DEFAULT_TIMEOUT_MS = 15_000;

export const upstreamUnreachableDetail =
  "Cannot reach the Hyglow API. Start the backend (uvicorn) and set BACKEND_URL in frontend/.env.local (e.g. http://127.0.0.1:8000).";

export type BackendJsonResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: 502; data: { detail: string } };

export async function fetchBackendJson(
  path: string,
  init: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<BackendJsonResult> {
  const base = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(url, { ...init, signal: ac.signal });
  } catch {
    clearTimeout(t);
    return { ok: false, status: 502, data: { detail: upstreamUnreachableDetail } };
  }
  clearTimeout(t);

  const text = await res.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { detail: text.slice(0, 200) || "Unexpected response from API" };
    }
  }
  return { ok: true, status: res.status, data };
}

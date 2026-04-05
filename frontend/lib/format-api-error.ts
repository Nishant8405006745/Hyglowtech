/**
 * Turn FastAPI / Next proxy error bodies into a single user-visible string.
 */
export function formatApiErrorBody(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Something went wrong. Please try again.";
  }

  const o = data as Record<string, unknown>;

  if (typeof o.detail === "string") {
    return o.detail;
  }

  if (typeof o.message === "string" && o.message !== "Validation error") {
    return o.message;
  }

  if (Array.isArray(o.detail)) {
    const parts = o.detail.map((item: unknown) => {
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        const loc = Array.isArray(row.loc) ? row.loc.filter((x) => x !== "body").join(".") : "";
        const msg = typeof row.msg === "string" ? row.msg : JSON.stringify(item);
        return loc ? `${loc}: ${msg}` : msg;
      }
      return String(item);
    });
    return parts.join("; ") || "Invalid input. Check your email and password.";
  }

  if (typeof o.detail === "object" && o.detail !== null) {
    return JSON.stringify(o.detail);
  }

  return "Something went wrong. Please try again.";
}

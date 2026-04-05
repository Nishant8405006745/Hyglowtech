/** HTTP-only cookie storing the JWT from FastAPI (set by Next.js Route Handlers). */
export const ACCESS_TOKEN_COOKIE = "hyglow_access_token";

/** Browser calls this path; Next rewrites to FastAPI with the cookie token. */
export const BFF_API_BASE = "/api/v1";

export const ROLE_SUPER_ADMIN = "Super Admin";
export const ROLE_ADMIN = "Admin";
export const ROLE_MANAGER = "Manager";
export const ROLE_USER = "User";

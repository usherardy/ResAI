import { createHash } from "node:crypto";

export const MAX_BODY_BYTES = 10_000;

/**
 * Best-effort client IP. On Vercel and most managed hosts the platform sets
 * x-forwarded-for, so the first entry is the client. If you self-host
 * behind your own proxy, make sure it overwrites (not appends to) this header.
 */
export function getClientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip")?.trim();
  return real || null;
}

let warnedAboutSalt = false;

/** One-way, salted hash so raw IPs and emails never land in the rate-limit table. */
export function hashIdentifier(value: string, salt = process.env.RATE_LIMIT_SALT): string {
  if (!salt) {
    if (!warnedAboutSalt && process.env.NODE_ENV === "production") {
      console.warn("[security] RATE_LIMIT_SALT is not set; using a fallback salt.");
      warnedAboutSalt = true;
    }
    salt = "resai-dev-salt";
  }
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

/**
 * Rejects cross-site browser POSTs. Requests without an Origin header (for
 * example server-to-server or curl) are allowed. They can't carry a
 * visitor's cookies anyway, and the other spam checks still apply.
 */
export function isSameOrigin(request: Request, extraAllowedOrigins: string[] = []): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    const site = request.headers.get("sec-fetch-site");
    return site === null || site === "same-origin" || site === "none";
  }
  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (host && parsed.host === host) return true;
  return extraAllowedOrigins.includes(parsed.origin);
}

export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413 | 415; message: string };

/** Reads a small JSON body with content-type and size guards. */
export async function readJsonBody(
  request: Request,
  maxBytes = MAX_BODY_BYTES,
): Promise<JsonBodyResult> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { ok: false, status: 415, message: "Expected a JSON request." };
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) {
    return { ok: false, status: 413, message: "Request is too large." };
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return { ok: false, status: 413, message: "Request is too large." };
  }
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, status: 400, message: "Request body isn't valid JSON." };
  }
}

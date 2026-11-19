import { PRIVACY_NOTICE_VERSION } from "@/lib/site";
import type { RateLimiter } from "@/lib/security/rate-limit";
import { hashIdentifier } from "@/lib/security/request";
import { fieldErrorsFrom, optOutSchema, waitlistSchema, type WaitlistData } from "./schema";

/**
 * Core waitlist logic, kept free of Next.js and Supabase so it can be tested
 * with plain objects. The route handlers wire in real dependencies.
 */

export type LeadRecord = {
  email: string;
  business_name: string;
  phone: string;
  website: string | null;
  location_count: string | null;
  pos_problems: string[];
  pos_frustration: string | null;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  privacy_notice_version: string;
};

export type WaitlistRepository = {
  insertLead(lead: LeadRecord): Promise<{ status: "created" | "duplicate" }>;
  recordOptOut(email: string): Promise<void>;
};

export type ServiceDeps = {
  /** null when Supabase isn't configured. */
  repository: WaitlistRepository | null;
  limiter: RateLimiter;
  log?: (message: string, meta?: Record<string, unknown>) => void;
};

export type ApiSuccess = { ok: true; message: string };
export type ApiError = {
  ok: false;
  error: "validation" | "rate_limited" | "unavailable" | "server_error" | "bad_request";
  message: string;
  fieldErrors?: Record<string, string>;
};
export type ServiceResult = { status: number; body: ApiSuccess | ApiError };

/** Submissions faster than this are almost certainly bots. */
export const MIN_FILL_MS = 2_000;

export const RATE_LIMITS = {
  waitlistPerIp: { limit: 5, windowSeconds: 10 * 60 },
  waitlistPerEmail: { limit: 3, windowSeconds: 60 * 60 },
  optOutPerIp: { limit: 10, windowSeconds: 10 * 60 },
} as const;

export const MESSAGES = {
  joined: "You’re on the list. We’ll be in touch as early access opens up.",
  optedOut:
    "Done. If that email is on our list, we won’t contact you about ResAI again.",
  validation: "Please check the highlighted fields.",
  rateLimited: "Too many attempts. Please wait a few minutes and try again.",
  unavailable:
    "Signups are temporarily unavailable, and nothing was saved. Please try again later or email us.",
  optOutUnavailable:
    "Opt-outs are temporarily unavailable through this form. Please email us and we’ll handle it by hand.",
  serverError:
    "Something went wrong on our end, and your details weren’t saved. Please try again.",
} as const;

const ok = (message: string): ServiceResult => ({
  status: 200,
  body: { ok: true, message },
});

const fail = (
  status: number,
  error: ApiError["error"],
  message: string,
  fieldErrors?: Record<string, string>,
): ServiceResult => ({
  status,
  body: fieldErrors ? { ok: false, error, message, fieldErrors } : { ok: false, error, message },
});

function readSpamSignals(raw: unknown): { honeypot: boolean; elapsedMs: number | null } {
  if (!raw || typeof raw !== "object") return { honeypot: false, elapsedMs: null };
  const record = raw as Record<string, unknown>;
  // The forms send their hidden trap field as `honeypot`. People never see it.
  const honeypot = typeof record.honeypot === "string" && record.honeypot.trim() !== "";
  const elapsed = record.elapsedMs;
  const elapsedMs =
    typeof elapsed === "number" && Number.isFinite(elapsed) && elapsed >= 0 ? elapsed : null;
  return { honeypot, elapsedMs };
}

export function toLeadRecord(data: WaitlistData): LeadRecord {
  return {
    email: data.email,
    business_name: data.businessName,
    phone: data.phone,
    website: data.website ?? null,
    location_count: data.locations ?? null,
    pos_problems: data.posProblems,
    pos_frustration: data.frustration ?? null,
    source: "landing_page",
    utm_source: data.utmSource ?? null,
    utm_medium: data.utmMedium ?? null,
    utm_campaign: data.utmCampaign ?? null,
    privacy_notice_version: PRIVACY_NOTICE_VERSION,
  };
}

export async function submitWaitlist(
  raw: unknown,
  context: { clientIp: string | null },
  deps: ServiceDeps,
): Promise<ServiceResult> {
  const log = deps.log ?? (() => {});

  // 1. Spam signals first, so bots never learn which fields are validated.
  //    Bots get a normal-looking success and nothing is stored.
  const spam = readSpamSignals(raw);
  if (spam.honeypot || spam.elapsedMs === null || spam.elapsedMs < MIN_FILL_MS) {
    log("waitlist: dropped likely spam", {
      honeypot: spam.honeypot,
      elapsedMs: spam.elapsedMs,
    });
    return ok(MESSAGES.joined);
  }

  // 2. Validate.
  const parsed = waitlistSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(400, "validation", MESSAGES.validation, fieldErrorsFrom(parsed.error));
  }
  const data = parsed.data;

  // 3. Never pretend to save if there's nowhere to save to.
  if (!deps.repository) {
    log("waitlist: repository not configured");
    return fail(503, "unavailable", MESSAGES.unavailable);
  }

  // 4. Rate limits per IP and per email (both hashed).
  const ipKey = hashIdentifier(context.clientIp ?? "unknown");
  const emailKey = hashIdentifier(data.email);
  const { waitlistPerIp, waitlistPerEmail } = RATE_LIMITS;
  const ipAllowed = await deps.limiter.consume(
    `waitlist:ip:${ipKey}`,
    waitlistPerIp.limit,
    waitlistPerIp.windowSeconds,
  );
  const emailAllowed =
    ipAllowed &&
    (await deps.limiter.consume(
      `waitlist:email:${emailKey}`,
      waitlistPerEmail.limit,
      waitlistPerEmail.windowSeconds,
    ));
  if (!ipAllowed || !emailAllowed) {
    return fail(429, "rate_limited", MESSAGES.rateLimited);
  }

  // 5. Store. A duplicate gets the same response as a new signup, so the
  //    form can't be used to check whether someone is on the list.
  try {
    const result = await deps.repository.insertLead(toLeadRecord(data));
    log("waitlist: stored", { status: result.status });
    return ok(MESSAGES.joined);
  } catch (error) {
    log("waitlist: insert failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return fail(500, "server_error", MESSAGES.serverError);
  }
}

export async function submitOptOut(
  raw: unknown,
  context: { clientIp: string | null },
  deps: ServiceDeps,
): Promise<ServiceResult> {
  const log = deps.log ?? (() => {});

  const spam = readSpamSignals(raw);
  if (spam.honeypot) return ok(MESSAGES.optedOut);

  const parsed = optOutSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(400, "validation", MESSAGES.validation, fieldErrorsFrom(parsed.error));
  }

  if (!deps.repository) {
    log("opt-out: repository not configured");
    return fail(503, "unavailable", MESSAGES.optOutUnavailable);
  }

  const { optOutPerIp } = RATE_LIMITS;
  const allowed = await deps.limiter.consume(
    `optout:ip:${hashIdentifier(context.clientIp ?? "unknown")}`,
    optOutPerIp.limit,
    optOutPerIp.windowSeconds,
  );
  if (!allowed) return fail(429, "rate_limited", MESSAGES.rateLimited);

  try {
    await deps.repository.recordOptOut(parsed.data.email);
    return ok(MESSAGES.optedOut);
  } catch (error) {
    log("opt-out: failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return fail(500, "server_error", MESSAGES.serverError);
  }
}

import { describe, expect, it, vi } from "vitest";
import { PRIVACY_NOTICE_VERSION } from "@/lib/site";
import type { RateLimiter } from "@/lib/security/rate-limit";
import {
  MESSAGES,
  submitOptOut,
  submitWaitlist,
  type LeadRecord,
  type ServiceDeps,
  type WaitlistRepository,
} from "@/lib/waitlist/service";

const human = {
  email: "Owner@CornerSlice.com",
  businessName: "Corner Slice",
  phone: "(415) 555-0134",
  website: "cornerslice.com",
  posProblems: ["hardware", "fees"],
  honeypot: "",
  elapsedMs: 9_000,
};

function makeDeps(overrides: Partial<ServiceDeps> = {}) {
  const stored: LeadRecord[] = [];
  const optOuts: string[] = [];
  const repository: WaitlistRepository = {
    insertLead: vi.fn(async (lead: LeadRecord) => {
      if (stored.some((l) => l.email === lead.email)) return { status: "duplicate" as const };
      stored.push(lead);
      return { status: "created" as const };
    }),
    recordOptOut: vi.fn(async (email: string) => {
      optOuts.push(email);
    }),
  };
  const limiter: RateLimiter = { consume: vi.fn(async () => true) };
  const deps: ServiceDeps = { repository, limiter, ...overrides };
  return { deps, stored, optOuts, repository, limiter };
}

const ctx = { clientIp: "203.0.113.7" };

describe("submitWaitlist", () => {
  it("stores a valid signup and returns success", async () => {
    const { deps, stored } = makeDeps();
    const result = await submitWaitlist(human, ctx, deps);

    expect(result).toEqual({ status: 200, body: { ok: true, message: MESSAGES.joined } });
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      email: "owner@cornerslice.com",
      business_name: "Corner Slice",
      phone: "+14155550134",
      website: "https://cornerslice.com",
      location_count: null,
      pos_problems: ["hardware", "fees"],
      pos_frustration: null,
      source: "landing_page",
      privacy_notice_version: PRIVACY_NOTICE_VERSION,
    });
  });

  it("returns the identical response for a duplicate email and stores nothing new", async () => {
    const { deps, stored } = makeDeps();
    const first = await submitWaitlist(human, ctx, deps);
    const second = await submitWaitlist({ ...human, email: "owner@cornerslice.com" }, ctx, deps);

    expect(second).toEqual(first);
    expect(stored).toHaveLength(1);
  });

  it("returns field errors for invalid input", async () => {
    const { deps, repository } = makeDeps();
    const result = await submitWaitlist(
      { ...human, email: "nope", businessName: "", phone: "123" },
      ctx,
      deps,
    );

    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({ ok: false, error: "validation" });
    expect(result.body.ok === false && result.body.fieldErrors).toMatchObject({
      email: expect.any(String),
      businessName: expect.any(String),
      phone: expect.any(String),
    });
    expect(repository.insertLead).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions with a fake success", async () => {
    const { deps, repository } = makeDeps();
    const result = await submitWaitlist({ ...human, honeypot: "http://spam.example" }, ctx, deps);

    expect(result.status).toBe(200);
    expect(repository.insertLead).not.toHaveBeenCalled();
  });

  it("stores signups that fill in the real website field", async () => {
    const { deps, stored } = makeDeps();
    const result = await submitWaitlist({ ...human, website: "https://cornerslice.com" }, ctx, deps);

    expect(result.status).toBe(200);
    expect(stored).toHaveLength(1);
  });

  it("silently drops submissions that are too fast or missing timing", async () => {
    const { deps, repository } = makeDeps();
    expect((await submitWaitlist({ ...human, elapsedMs: 300 }, ctx, deps)).status).toBe(200);
    expect((await submitWaitlist({ ...human, elapsedMs: undefined }, ctx, deps)).status).toBe(200);
    expect((await submitWaitlist({ ...human, elapsedMs: "9000" }, ctx, deps)).status).toBe(200);
    expect(repository.insertLead).not.toHaveBeenCalled();
  });

  it("never claims success when storage isn't configured", async () => {
    const { deps } = makeDeps({ repository: null });
    const result = await submitWaitlist(human, ctx, deps);

    expect(result.status).toBe(503);
    expect(result.body).toMatchObject({ ok: false, error: "unavailable" });
  });

  it("returns 429 when rate limited", async () => {
    const limiter: RateLimiter = { consume: vi.fn(async () => false) };
    const { deps, repository } = makeDeps({ limiter });
    const result = await submitWaitlist(human, ctx, deps);

    expect(result.status).toBe(429);
    expect(repository.insertLead).not.toHaveBeenCalled();
  });

  it("uses hashed buckets (no raw IPs or emails) for rate limiting", async () => {
    const { deps, limiter } = makeDeps();
    await submitWaitlist(human, ctx, deps);

    const buckets = vi.mocked(limiter.consume).mock.calls.map((call) => call[0]);
    expect(buckets).toHaveLength(2);
    for (const bucket of buckets) {
      expect(bucket).not.toContain("203.0.113.7");
      expect(bucket).not.toContain("cornerslice");
      expect(bucket).toMatch(/^waitlist:(ip|email):[a-f0-9]{64}$/);
    }
  });

  it("returns 500 (not success) when the insert fails", async () => {
    const { deps } = makeDeps();
    deps.repository!.insertLead = vi.fn(async () => {
      throw new Error("connection reset");
    });
    const result = await submitWaitlist(human, ctx, deps);

    expect(result.status).toBe(500);
    expect(result.body.ok).toBe(false);
  });
});

describe("submitOptOut", () => {
  it("records a normalized opt-out", async () => {
    const { deps, optOuts } = makeDeps();
    const result = await submitOptOut({ email: " Owner@CornerSlice.com " }, ctx, deps);

    expect(result).toEqual({ status: 200, body: { ok: true, message: MESSAGES.optedOut } });
    expect(optOuts).toEqual(["owner@cornerslice.com"]);
  });

  it("validates the email", async () => {
    const { deps } = makeDeps();
    expect((await submitOptOut({ email: "nope" }, ctx, deps)).status).toBe(400);
  });

  it("returns 503 when storage isn't configured", async () => {
    const { deps } = makeDeps({ repository: null });
    expect((await submitOptOut({ email: "a@b.co" }, ctx, deps)).status).toBe(503);
  });

  it("ignores honeypot submissions", async () => {
    const { deps, optOuts } = makeDeps();
    const result = await submitOptOut({ email: "a@b.co", honeypot: "x" }, ctx, deps);
    expect(result.status).toBe(200);
    expect(optOuts).toHaveLength(0);
  });
});

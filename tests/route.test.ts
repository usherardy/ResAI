import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ServiceDeps } from "@/lib/waitlist/service";

const testDeps: { current: ServiceDeps | null } = { current: null };

vi.mock("@/lib/waitlist/deps", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/waitlist/deps")>();
  return {
    getServiceDeps: () => testDeps.current ?? actual.getServiceDeps(),
  };
});

const { POST: waitlistPOST } = await import("@/app/api/waitlist/route");
const { POST: optOutPOST } = await import("@/app/api/opt-out/route");

const validBody = {
  email: "owner@cornerslice.com",
  businessName: "Corner Slice",
  website: "",
  elapsedMs: 5_000,
};

function post(body: unknown, headers: Record<string, string> = {}, url = "http://localhost:3000/api/waitlist") {
  return new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
      origin: "http://localhost:3000",
      "x-forwarded-for": "198.51.100.4, 10.0.0.1",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/waitlist", () => {
  const savedEnv = { ...process.env };

  beforeEach(() => {
    testDeps.current = null;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  it("returns 503 without Supabase credentials and never reports success", async () => {
    const res = await waitlistPOST(post(validBody));
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, error: "unavailable" });
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("returns 400 with field errors for invalid input", async () => {
    const res = await waitlistPOST(post({ ...validBody, email: "bad" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.fieldErrors.email).toBeDefined();
  });

  it("rejects non-JSON requests", async () => {
    const res = await waitlistPOST(post("email=a@b.co", { "content-type": "application/x-www-form-urlencoded" }));
    expect(res.status).toBe(415);
  });

  it("rejects malformed JSON", async () => {
    const res = await waitlistPOST(post("{not json"));
    expect(res.status).toBe(400);
  });

  it("rejects oversized bodies", async () => {
    const res = await waitlistPOST(post({ ...validBody, frustration: "x".repeat(20_000) }));
    expect(res.status).toBe(413);
  });

  it("rejects cross-site browser requests", async () => {
    const res = await waitlistPOST(post(validBody, { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });

  it("passes the first forwarded IP to the service and stores via the repository", async () => {
    const insertLead = vi.fn(async () => ({ status: "created" as const }));
    const consume = vi.fn(async () => true);
    testDeps.current = {
      repository: { insertLead, recordOptOut: vi.fn() },
      limiter: { consume },
    };

    const res = await waitlistPOST(post(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true });
    expect(insertLead).toHaveBeenCalledOnce();
    expect(consume).toHaveBeenCalledTimes(2);
  });
});

describe("POST /api/opt-out", () => {
  it("records an opt-out through the repository", async () => {
    const recordOptOut = vi.fn(async () => {});
    testDeps.current = {
      repository: { insertLead: vi.fn(), recordOptOut },
      limiter: { consume: async () => true },
    };
    const res = await optOutPOST(
      post({ email: "Owner@CornerSlice.com" }, {}, "http://localhost:3000/api/opt-out"),
    );
    expect(res.status).toBe(200);
    expect(recordOptOut).toHaveBeenCalledWith("owner@cornerslice.com");
  });
});

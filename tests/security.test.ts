import { describe, expect, it, vi } from "vitest";
import { chainRateLimiters, createMemoryRateLimiter } from "@/lib/security/rate-limit";
import { getClientIp, hashIdentifier, isSameOrigin } from "@/lib/security/request";

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": "203.0.113.1, 10.0.0.2" }))).toBe("203.0.113.1");
  });
  it("falls back to x-real-ip, then null", () => {
    expect(getClientIp(new Headers({ "x-real-ip": "203.0.113.9" }))).toBe("203.0.113.9");
    expect(getClientIp(new Headers())).toBeNull();
  });
});

describe("hashIdentifier", () => {
  it("is deterministic per salt and never contains the input", () => {
    const a = hashIdentifier("203.0.113.1", "salt-a");
    expect(a).toBe(hashIdentifier("203.0.113.1", "salt-a"));
    expect(a).not.toBe(hashIdentifier("203.0.113.1", "salt-b"));
    expect(a).toMatch(/^[a-f0-9]{64}$/);
    expect(a).not.toContain("203");
  });
});

describe("isSameOrigin", () => {
  const req = (headers: Record<string, string>) =>
    new Request("http://localhost:3000/api/waitlist", { method: "POST", headers });

  it("allows matching origin and host", () => {
    expect(isSameOrigin(req({ origin: "http://localhost:3000", host: "localhost:3000" }))).toBe(true);
  });
  it("allows explicitly configured origins", () => {
    expect(
      isSameOrigin(req({ origin: "https://resai.example", host: "internal:3000" }), ["https://resai.example"]),
    ).toBe(true);
  });
  it("blocks other origins", () => {
    expect(isSameOrigin(req({ origin: "https://evil.example", host: "localhost:3000" }))).toBe(false);
    expect(isSameOrigin(req({ origin: "null", host: "localhost:3000" }))).toBe(false);
  });
  it("blocks cross-site fetch metadata when Origin is missing", () => {
    expect(isSameOrigin(req({ "sec-fetch-site": "cross-site" }))).toBe(false);
    expect(isSameOrigin(req({}))).toBe(true);
  });
});

describe("createMemoryRateLimiter", () => {
  it("allows up to the limit within the window, then resets", async () => {
    let now = 1_000_000;
    const limiter = createMemoryRateLimiter({ now: () => now });

    for (let i = 0; i < 3; i++) expect(await limiter.consume("k", 3, 60)).toBe(true);
    expect(await limiter.consume("k", 3, 60)).toBe(false);
    expect(await limiter.consume("other", 3, 60)).toBe(true);

    now += 61_000;
    expect(await limiter.consume("k", 3, 60)).toBe(true);
  });

  it("caps memory use by evicting the oldest keys", async () => {
    const limiter = createMemoryRateLimiter({ maxKeys: 2 });
    await limiter.consume("a", 1, 60);
    await limiter.consume("b", 1, 60);
    await limiter.consume("c", 1, 60); // evicts "a"
    expect(await limiter.consume("a", 1, 60)).toBe(true);
  });
});

describe("chainRateLimiters", () => {
  it("denies if any limiter denies", async () => {
    const chain = chainRateLimiters([{ consume: async () => true }, { consume: async () => false }]);
    expect(await chain.consume("k", 1, 60)).toBe(false);
  });

  it("fails open (and reports) when a limiter errors", async () => {
    const onError = vi.fn();
    const chain = chainRateLimiters(
      [
        {
          consume: async () => {
            throw new Error("db down");
          },
        },
      ],
      onError,
    );
    expect(await chain.consume("k", 1, 60)).toBe(true);
    expect(onError).toHaveBeenCalledOnce();
  });
});

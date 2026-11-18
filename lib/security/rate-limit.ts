export type RateLimiter = {
  /**
   * Records one hit for `bucket` and returns true if it's still within
   * `limit` hits per `windowSeconds`.
   */
  consume(bucket: string, limit: number, windowSeconds: number): Promise<boolean>;
};

/**
 * Per-instance, in-memory sliding window. Cheap first line of defense. On
 * serverless each instance has its own memory, so the database-backed
 * limiter is the one that actually holds across instances.
 */
export function createMemoryRateLimiter({
  maxKeys = 5_000,
  now = () => Date.now(),
}: { maxKeys?: number; now?: () => number } = {}): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    async consume(bucket, limit, windowSeconds) {
      const current = now();
      const windowStart = current - windowSeconds * 1000;
      const recent = (hits.get(bucket) ?? []).filter((t) => t > windowStart);

      if (recent.length >= limit) {
        hits.set(bucket, recent);
        return false;
      }

      recent.push(current);
      hits.delete(bucket); // re-insert so Map order tracks recency
      hits.set(bucket, recent);

      if (hits.size > maxKeys) {
        const oldest = hits.keys().next().value;
        if (oldest !== undefined) hits.delete(oldest);
      }
      return true;
    },
  };
}

/**
 * Chains limiters: the first "no" wins. If a limiter errors (say the
 * database is briefly unreachable), it's skipped so real signups aren't
 * blocked. The error is passed to `onError` for logging.
 */
export function chainRateLimiters(
  limiters: RateLimiter[],
  onError: (error: unknown) => void = (error) =>
    console.error("[rate-limit] limiter failed; allowing request", error),
): RateLimiter {
  return {
    async consume(bucket, limit, windowSeconds) {
      for (const limiter of limiters) {
        try {
          const allowed = await limiter.consume(bucket, limit, windowSeconds);
          if (!allowed) return false;
        } catch (error) {
          onError(error);
        }
      }
      return true;
    },
  };
}

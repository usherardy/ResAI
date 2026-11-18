import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  chainRateLimiters,
  createMemoryRateLimiter,
  type RateLimiter,
} from "@/lib/security/rate-limit";
import { createSupabaseRateLimiter, createSupabaseRepository } from "./repository";
import type { ServiceDeps } from "./service";

// One in-memory limiter per server instance, shared by both routes.
const memoryLimiter = createMemoryRateLimiter();

function log(message: string, meta?: Record<string, unknown>) {
  // Never log submitted personal data here, only outcomes.
  console.info(`[waitlist] ${message}`, meta ?? "");
}

export function getServiceDeps(): ServiceDeps {
  const supabase = getSupabaseAdmin();
  const limiters: RateLimiter[] = [memoryLimiter];
  if (supabase) limiters.push(createSupabaseRateLimiter(supabase));

  return {
    repository: supabase ? createSupabaseRepository(supabase) : null,
    limiter: chainRateLimiters(limiters),
    log,
  };
}

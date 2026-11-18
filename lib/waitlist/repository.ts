import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { RateLimiter } from "@/lib/security/rate-limit";
import type { LeadRecord, WaitlistRepository } from "./service";

const UNIQUE_VIOLATION = "23505";

export function createSupabaseRepository(client: SupabaseClient): WaitlistRepository {
  return {
    async insertLead(lead: LeadRecord) {
      // No .select(): the insert returns nothing (return=minimal).
      const { error } = await client.from("waitlist_leads").insert(lead);
      if (!error) return { status: "created" };
      if (error.code === UNIQUE_VIOLATION) return { status: "duplicate" };
      throw new Error(`waitlist insert failed (${error.code ?? "unknown"}): ${error.message}`);
    },

    async recordOptOut(email: string) {
      const { error } = await client.rpc("record_outreach_opt_out", { p_email: email });
      if (error) {
        throw new Error(`opt-out failed (${error.code ?? "unknown"}): ${error.message}`);
      }
    },
  };
}

/** Database-backed limiter, shared across all server instances. */
export function createSupabaseRateLimiter(client: SupabaseClient): RateLimiter {
  return {
    async consume(bucket, limit, windowSeconds) {
      const { data, error } = await client.rpc("consume_rate_limit", {
        p_bucket: bucket,
        p_limit: limit,
        p_window_seconds: windowSeconds,
      });
      if (error) {
        throw new Error(`rate limit check failed (${error.code ?? "unknown"}): ${error.message}`);
      }
      return data === true;
    },
  };
}

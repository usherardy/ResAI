import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service-role (or `sb_secret_…`) key.
 *
 * - The `server-only` import makes the build fail if this file is ever
 *   pulled into a client bundle.
 * - The env vars are deliberately NOT prefixed with NEXT_PUBLIC_, so Next.js
 *   never inlines them into browser JavaScript.
 * - The tables have RLS enabled with no policies, so the public anon key
 *   can't read or write them even if someone has it.
 */

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  for (const name of Object.keys(process.env)) {
    if (name.startsWith("NEXT_PUBLIC_") && /SERVICE_ROLE|SECRET/i.test(name)) {
      console.error(
        `[supabase] ${name} looks like a secret exposed to the browser. Remove the NEXT_PUBLIC_ prefix.`,
      );
    }
  }

  if (!client) {
    client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: { headers: { "x-client-info": "resai-web" } },
    });
  }
  return client;
}

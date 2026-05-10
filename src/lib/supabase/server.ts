import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { env } from "@/constants/env";

// Server-only client using the service role key (full DB access, bypasses RLS).
// Import only in Server Components, API routes, or server actions.
export function createServerClient() {
  const key = env.supabase.serviceRoleKey ?? env.supabase.anonKey;
  return createClient<Database>(env.supabase.url, key, {
    auth: { persistSession: false },
  });
}

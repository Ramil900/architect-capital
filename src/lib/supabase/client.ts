import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { env } from "@/constants/env";

let _client: SupabaseClient<Database> | null = null;

// Lazy singleton — initialised on first call, not at module load time.
export function getBrowserClient(): SupabaseClient<Database> {
  if (!_client) {
    _client = createClient<Database>(env.supabase.url, env.supabase.anonKey);
  }
  return _client;
}

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { env } from "@/constants/env";

let _client: SupabaseClient<Database> | null = null;

// Lazy singleton — stores session in cookies so middleware can read it.
export function getBrowserClient(): SupabaseClient<Database> {
  if (!_client) {
    _client = createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnon);
  }
  return _client;
}

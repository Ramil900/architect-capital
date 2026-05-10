import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { env } from "@/constants/env";

export function createBrowserClient() {
  return createClient<Database>(env.supabase.url, env.supabase.anonKey);
}

export const supabase = createBrowserClient();

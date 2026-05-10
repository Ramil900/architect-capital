import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";
import { env } from "@/constants/env";

// Server-only client — reads/writes session via cookies for App Router compatibility.
// Import only in Server Components, API routes, or server actions.
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSSRClient<Database>(env.supabaseUrl, env.supabaseAnon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component — cookie writes are a no-op, middleware handles refresh.
        }
      },
    },
  });
}

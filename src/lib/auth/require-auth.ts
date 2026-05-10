import { getSession } from "@/lib/auth/get-session";
import type { Session } from "@supabase/supabase-js";

// Placeholder — wire up redirect once middleware is added.
// Usage in a Server Component or API route:
//   const session = await requireAuth();
export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  return session;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

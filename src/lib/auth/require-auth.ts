import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import type { Session } from "@supabase/supabase-js";

// Call in Server Components or Route Handlers to enforce authentication.
export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

import { createServerClient } from "@/lib/supabase/server";
import type { Session, User } from "@supabase/supabase-js";

export async function getSession(): Promise<Session | null> {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

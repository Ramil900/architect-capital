import { requireAuth } from "@/lib/auth/require-auth";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default async function AuthGuard({ children }: Props) {
  await requireAuth();
  return <>{children}</>;
}

// TODO: wire up real session check once auth middleware is active.
// Future implementation:
//   const session = await getSession();
//   if (!session) redirect("/login");

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthGuard({ children }: Props) {
  return <>{children}</>;
}

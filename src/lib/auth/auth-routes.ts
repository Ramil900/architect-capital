export const PUBLIC_ROUTES = ["/login", "/register"] as const;

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/portfolio",
  "/market",
  "/ai-strategy",
  "/dca",
  "/rebalancing",
  "/reports",
  "/settings",
] as const;

export type PublicRoute   = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

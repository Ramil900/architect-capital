import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedRoute, isPublicRoute } from "@/lib/auth/auth-routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TODO: replace with real Supabase session check once auth is fully wired.
  // Example future implementation:
  //   const session = await getSessionFromCookies(request);
  //   if (isProtectedRoute(pathname) && !session) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  //   if (isPublicRoute(pathname) && session) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }

  // Skeleton: log route type in development only, always pass through.
  if (process.env.NODE_ENV === "development") {
    if (isProtectedRoute(pathname)) {
      console.log(`[middleware] protected route: ${pathname}`);
    } else if (isPublicRoute(pathname)) {
      console.log(`[middleware] public route: ${pathname}`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED = ["/account", "/orders", "/wishlist", "/checkout"];
const ADMIN = ["/admin"];
const AUTH_PAGE = "/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = getSessionCookie(req);

  // Redirect unauthenticated users away from protected routes
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = AUTH_PAGE;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth page
  if (pathname.startsWith(AUTH_PAGE) && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Admin — redirect unauthenticated users to auth
  // Full role check is done server-side in app/(admin)/layout.tsx
  if (ADMIN.some((p) => pathname.startsWith(p)) && !session) {
    const url = req.nextUrl.clone();
    url.pathname = AUTH_PAGE;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};

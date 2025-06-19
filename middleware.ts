import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

// Only run middleware on routes that matter
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api/auth|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

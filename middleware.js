import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Only protect /admin route
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // If user not logged in or not an admin
    if (!token || !token.email || !["abhi120730@gmail.com", "anotheradmin@earthsome.com"].includes(token.email)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Protect /admin and all nested routes
};

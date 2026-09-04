import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/apple-ads-auth";

/**
 * Ends the session and returns to the sign-in form.
 *
 * Not covered by the middleware matcher, which only guards the exact
 * /apple-ads path — signing out should work whether or not the session is
 * still valid, and it hands out nothing.
 *
 * The cookie is expired by setting it again with maxAge 0 and the same name and
 * path. Path matters: a cookie set on /apple-ads is a different cookie from one
 * set on /, and clearing the wrong one leaves the session alive.
 */

export const dynamic = "force-dynamic";

function signOut(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/apple-ads", request.url), { status: 303 });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/apple-ads",
    maxAge: 0,
  });
  return response;
}

export function GET(request: NextRequest) {
  return signOut(request);
}

export function POST(request: NextRequest) {
  return signOut(request);
}

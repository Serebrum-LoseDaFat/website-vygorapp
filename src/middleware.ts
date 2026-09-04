import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/apple-ads-auth";

/**
 * Guards /apple-ads.
 *
 * The Apple Ads master guide carries real spend, funnel and conversion numbers.
 * It is not linked from anywhere, but "unlinked" is not private — a URL that is
 * guessable, or shared once, is public from then on.
 *
 * Without a valid signed session the request is rewritten to the sign-in page.
 * The guide route never runs, so an unauthenticated response contains no part of
 * the document — the sign-in page and the guide are separate routes, not one
 * page with content hidden by script.
 *
 * Only the exact /apple-ads path is matched. The sign-in page and its form
 * handler live underneath it and must stay reachable, or there would be no way
 * in.
 *
 * With no credentials configured the guard rewrites to sign-in as usual and the
 * form rejects every attempt, so a forgotten environment variable cannot open
 * the guide.
 */

export async function middleware(request: NextRequest) {
  const users = process.env.APPLE_ADS_USERS;
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value, users ?? "");

  if (session) return NextResponse.next();

  const signIn = new URL("/apple-ads/sign-in", request.url);
  return NextResponse.rewrite(signIn);
}

export const config = {
  matcher: ["/apple-ads"],
};

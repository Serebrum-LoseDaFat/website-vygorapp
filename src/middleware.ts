import { NextResponse, type NextRequest } from "next/server";

/**
 * HTTP Basic auth in front of /apple-ads.
 *
 * The Apple Ads master guide contains real spend, funnel and conversion numbers.
 * It is not linked from anywhere on the site, but "unlinked" is not private —
 * a URL that is guessable or shared once is public forever. This is the gate
 * that actually makes it private.
 *
 * WHY MIDDLEWARE AND NOT A PASSWORD FORM IN THE PAGE
 *
 * A React form that compares a password in the browser is theatre: the page and
 * its contents are already in the response by the time the form renders, so
 * anyone can read the guide from view-source or the network tab without ever
 * typing the password. Middleware runs before the route does, on the server, so
 * an unauthenticated request never receives the document at all.
 *
 * CREDENTIALS
 *
 * Read from APPLE_ADS_USERS, which is deliberately NOT prefixed NEXT_PUBLIC —
 * anything with that prefix is inlined into the client bundle and would ship the
 * passwords to every visitor. Format is a comma-separated list of user:password
 * pairs, so the two people who need it each get their own login:
 *
 *   APPLE_ADS_USERS=krishna:first-secret,hajira:second-secret
 *
 * No credentials are committed anywhere. If the variable is missing or empty the
 * route FAILS CLOSED and serves 503 rather than falling back to open, because a
 * forgotten environment variable should not silently publish the guide — that is
 * exactly how the store badges disappeared in production earlier in this project,
 * only here the consequence would be a leak rather than a missing button.
 */

const REALM = "Vygor internal";

type Credential = { user: string; pass: string };

function parseUsers(raw: string | undefined): Credential[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const split = pair.indexOf(":");
      if (split < 1) return null;
      return { user: pair.slice(0, split), pass: pair.slice(split + 1) };
    })
    .filter((c): c is Credential => c !== null && c.pass.length > 0);
}

/**
 * Length-independent comparison. `===` on secrets returns as soon as two bytes
 * differ, which leaks how much of a guess was correct; this always walks the
 * whole string. The edge runtime has no timingSafeEqual, so it is done by hand.
 */
function equals(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function challenge(): NextResponse {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(request: NextRequest) {
  const users = parseUsers(process.env.APPLE_ADS_USERS);

  if (users.length === 0) {
    return new NextResponse(
      "This page is not available: no credentials are configured for it.",
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return challenge();

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return challenge();
  }

  const split = decoded.indexOf(":");
  if (split < 0) return challenge();
  const user = decoded.slice(0, split);
  const pass = decoded.slice(split + 1);

  // Every candidate is checked, rather than stopping at the first match, so the
  // work done does not depend on which account was tried.
  let authorised = false;
  for (const candidate of users) {
    if (equals(candidate.user, user) && equals(candidate.pass, pass)) authorised = true;
  }

  return authorised ? NextResponse.next() : challenge();
}

export const config = {
  matcher: ["/apple-ads", "/apple-ads/:path*"],
};

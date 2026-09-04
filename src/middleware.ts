import { NextResponse, type NextRequest } from "next/server";

/**
 * Per-person access keys in front of /apple-ads.
 *
 * The Apple Ads master guide contains real spend, funnel and conversion
 * numbers. It is not linked from anywhere, but "unlinked" is not private — a
 * URL that is guessable, or shared once, is public from then on. This is the
 * gate that makes it private.
 *
 * HOW IT WORKS
 *
 * Each person gets their own long random key and a bookmark:
 *
 *   https://www.vygor.app/apple-ads?k=<their key>
 *
 * On a valid key the middleware sets an httpOnly cookie and redirects to the
 * clean /apple-ads. That redirect matters: after the first visit the key is out
 * of the address bar, so it stops appearing in the URL a screenshot would catch,
 * in anything pasted from the address bar, or in the Referer sent to the Google
 * Fonts request the guide makes. The cookie is httpOnly, so page scripts cannot
 * read it either.
 *
 * The cookie holds the key itself and is re-checked against the allowlist on
 * every request rather than being independently signed. That keeps revocation
 * immediate: remove a key from the environment variable and that person's
 * cookie stops working on the next request, with nothing to expire.
 *
 * WHY 404 AND NOT 401
 *
 * There is no login screen to show, so there is nothing to gain by admitting the
 * page exists. Anything without a valid key — no key, wrong key, or no keys
 * configured at all — gets an ordinary 404, identical to any other unknown URL.
 * Someone probing for the page learns nothing.
 *
 * That also means a misconfiguration looks like a 404. If a correct bookmark
 * returns 404, check APPLE_ADS_KEYS in Vercel before suspecting the key.
 *
 * WHAT THIS IS AND IS NOT
 *
 * Possession of the link is access: there is no second factor, so anyone who
 * gets a key can read the guide. It is far stronger than a short password —
 * 192 bits of randomness is not guessable — and it is revocable per person,
 * which a shared password is not. It is weaker than a real sign-in. Google
 * sign-in with an email allowlist is the upgrade path when the setup cost is
 * worth paying.
 *
 * CREDENTIALS
 *
 * APPLE_ADS_KEYS, deliberately NOT prefixed NEXT_PUBLIC — that prefix inlines a
 * value into the browser bundle and would publish every key. Format is
 * comma-separated name:key pairs, one per person:
 *
 *   APPLE_ADS_KEYS=krishna:<key>,hajira:<key>
 *
 * The name is only there so a key can be matched to a person when revoking; it
 * is never typed by anyone and never leaves the server.
 */

const COOKIE = "vygor_ads";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function parseKeys(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const split = pair.indexOf(":");
      // A bare key with no name is still usable, so both shapes are accepted.
      return split < 0 ? pair : pair.slice(split + 1);
    })
    .filter((key) => key.length >= 16);
}

/**
 * Length-independent comparison. `===` returns as soon as two bytes differ,
 * which leaks how much of a guess was right; this always walks the whole
 * string. The edge runtime has no timingSafeEqual, so it is done by hand.
 */
function equals(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function matches(keys: string[], candidate: string | undefined): boolean {
  if (!candidate) return false;
  // Every key is checked rather than stopping at the first hit, so the work
  // done does not reveal which person's key was tried.
  let found = false;
  for (const key of keys) if (equals(key, candidate)) found = true;
  return found;
}

/** Indistinguishable from any other unknown URL. */
function notFound(request: NextRequest): NextResponse {
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

export function middleware(request: NextRequest) {
  const keys = parseKeys(process.env.APPLE_ADS_KEYS);
  if (keys.length === 0) return notFound(request);

  // Already admitted on this device.
  if (matches(keys, request.cookies.get(COOKIE)?.value)) {
    return NextResponse.next();
  }

  // Arriving on a bookmark: accept the key, then get it out of the URL.
  const provided = request.nextUrl.searchParams.get("k");
  if (matches(keys, provided ?? undefined)) {
    const clean = new URL(request.nextUrl.pathname, request.url);
    const response = NextResponse.redirect(clean);
    response.cookies.set({
      name: COOKIE,
      value: provided as string,
      httpOnly: true,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      path: "/apple-ads",
      maxAge: MAX_AGE,
    });
    return response;
  }

  return notFound(request);
}

export const config = {
  matcher: ["/apple-ads", "/apple-ads/:path*"],
};

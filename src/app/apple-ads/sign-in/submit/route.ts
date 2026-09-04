import { NextResponse, type NextRequest } from "next/server";
import {
  createSession,
  parseUsers,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  verifyCredentials,
} from "@/lib/apple-ads-auth";

/**
 * Handles the sign-in form.
 *
 * On success: sets the signed session cookie and sends the visitor to
 * /apple-ads, which the middleware will now let through.
 *
 * On failure: back to the form with a generic message. The response never says
 * whether it was the name or the password that was wrong, because that tells
 * someone probing which names exist.
 */

export const dynamic = "force-dynamic";

/**
 * There is no datastore here, so no attempt counter and no lockout. A fixed
 * delay on failure is the honest mitigation available: it costs a real attacker
 * far more than it costs the two people who will occasionally mistype, and it
 * blunts an automated run without pretending to be rate limiting.
 */
const FAILURE_DELAY_MS = 700;

function redirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}

export async function POST(request: NextRequest) {
  const users = parseUsers(process.env.APPLE_ADS_USERS);

  const form = await request.formData().catch(() => null);
  const user = String(form?.get("user") ?? "");
  const pass = String(form?.get("pass") ?? "");

  const match = users.length > 0 ? verifyCredentials(users, user, pass) : null;

  if (!match) {
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return redirect(request, "/apple-ads/sign-in?error=1");
  }

  // The credential list doubles as the signing key, so changing any password
  // invalidates every session that was issued under the old one.
  const token = await createSession(match.user, process.env.APPLE_ADS_USERS ?? "");

  const response = redirect(request, "/apple-ads");
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/apple-ads",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

/** A bare GET here means a stale bookmark or a refresh; send them to the form. */
export function GET(request: NextRequest) {
  return redirect(request, "/apple-ads/sign-in");
}

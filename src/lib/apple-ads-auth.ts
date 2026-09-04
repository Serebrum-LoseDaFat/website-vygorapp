/**
 * Sign-in for the private Apple Ads guide.
 *
 * Shared by the middleware that guards /apple-ads and the route that handles
 * the sign-in form. Everything here uses Web Crypto rather than node:crypto so
 * the same code runs in the edge runtime the middleware executes in.
 *
 * THE SESSION IS SIGNED, NOT JUST SET
 *
 * A cookie saying "signed in" would be trivially forged — anyone could set it
 * in dev tools. The cookie instead carries `user.expiry.signature`, where the
 * signature is an HMAC the server computes over the first two parts. Tampering
 * with either invalidates it, and the signature cannot be produced without the
 * key.
 *
 * The signing key is derived from the credential list itself rather than being
 * a separate variable to configure. That has a useful consequence: changing any
 * password changes the key, which invalidates every existing session. So
 * removing someone's access takes effect on their next request, with no session
 * left to wait out.
 */

const COOKIE = "vygor_ads_session";
const SESSION_HOURS = 12;

export type Credential = { user: string; pass: string };

export function parseUsers(raw: string | undefined): Credential[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const split = pair.indexOf(":");
      if (split < 1) return null;
      return { user: pair.slice(0, split).toLowerCase(), pass: pair.slice(split + 1) };
    })
    .filter((c): c is Credential => c !== null && c.pass.length > 0);
}

/**
 * Length-independent comparison. `===` returns as soon as two bytes differ,
 * which leaks how much of a guess was correct.
 */
export function equals(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/** Checks a submitted name and password against the list. */
export function verifyCredentials(
  users: Credential[],
  user: string,
  pass: string,
): Credential | null {
  const submitted = user.trim().toLowerCase();
  // Every candidate is checked rather than stopping at the first match, so the
  // work done does not depend on which account was tried.
  let hit: Credential | null = null;
  for (const candidate of users) {
    if (equals(candidate.user, submitted) && equals(candidate.pass, pass)) hit = candidate;
  }
  return hit;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, keyMaterial: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keyMaterial),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

/** `user.expiry.signature`, safe to hand to the browser. */
export async function createSession(user: string, keyMaterial: string): Promise<string> {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `${user}.${expires}`;
  return `${payload}.${await sign(payload, keyMaterial)}`;
}

/** Returns the signed-in user, or null if the cookie is absent, forged or stale. */
export async function readSession(
  token: string | undefined,
  keyMaterial: string,
): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [user, expires, signature] = parts;

  const expected = await sign(`${user}.${expires}`, keyMaterial);
  if (!equals(expected, signature)) return null;

  const at = Number(expires);
  if (!Number.isFinite(at) || at < Date.now()) return null;
  return user;
}

export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = SESSION_HOURS * 60 * 60;

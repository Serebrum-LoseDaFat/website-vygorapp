import {
  CREDENTIALS,
  PBKDF2_ITERATIONS,
  PBKDF2_KEY_BYTES,
  type StoredCredential,
} from "./apple-ads-credentials";

/**
 * Sign-in for the private Apple Ads guide.
 *
 * Shared by the middleware guarding /apple-ads and the route handling the
 * sign-in form. Web Crypto throughout, so the same code runs in the edge
 * runtime the middleware executes in.
 *
 * NO SECRET LIVES OUTSIDE THE PASSWORD
 *
 * Credentials are committed as salted PBKDF2 hashes, so no environment variable
 * has to be configured for this to work. That constraint shapes the session
 * design, and the shape it rules out is worth spelling out:
 *
 * The session used to be a cookie signed with an HMAC whose key came from the
 * credential list. That was fine while the list was a secret in the
 * environment. It becomes worthless the moment the list is committed — anyone
 * reading the repository would hold the signing key and could mint a valid
 * session cookie, walking past the sign-in form entirely.
 *
 * So there is no signing key. The cookie carries the credential itself, and
 * every request re-derives the hash and compares it to the stored one. Forging
 * it requires knowing the password, which is the only thing not in the
 * repository. It also means revocation is immediate: regenerate the credentials
 * file and existing cookies stop verifying on the next request.
 *
 * The cost is a PBKDF2 derivation per request to /apple-ads rather than a cheap
 * signature check. At this iteration count that is deliberate — it is the same
 * work that makes offline guessing expensive — and it applies to one route that
 * two people open occasionally.
 *
 * WHAT THE HASHES DO NOT DO
 *
 * They stop a reader of the repository seeing the passwords. They do not stop
 * that reader guessing them: salt and hash in hand, candidates can be tested
 * offline. The iteration count sets the price per guess, so the protection is
 * only ever as good as the password is unpredictable.
 */

const COOKIE = "vygor_ads_session";
const SESSION_HOURS = 12;

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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

async function derive(password: string, saltB64: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    // Normalised so an accented character typed two different ways still
    // matches the stored hash.
    encoder.encode(password.normalize("NFKC")),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromBase64Url(saltB64) as unknown as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    PBKDF2_KEY_BYTES * 8,
  );
  return toBase64Url(new Uint8Array(bits));
}

/** Checks a name and password against the committed hashes. */
export async function verifyCredentials(
  user: string,
  pass: string,
): Promise<StoredCredential | null> {
  // Trimmed on both sides: a password pasted from a manager or a message often
  // carries a trailing space, and without this it fails with a message that
  // gives no hint the credential was actually right.
  const submitted = user.trim().toLowerCase();
  const secret = pass.trim();
  if (!secret) return null;

  const record = CREDENTIALS.find((c) => equals(c.user, submitted));
  if (!record) {
    // Derive anyway against a real salt, so an unknown name does not answer
    // faster than a known one and reveal which names exist.
    if (CREDENTIALS[0]) await derive(secret, CREDENTIALS[0].salt);
    return null;
  }

  const derived = await derive(secret, record.salt);
  return equals(derived, record.hash) ? record : null;
}

/**
 * The cookie value: the credential itself, joined so one field cannot be
 * shifted into another. Verified against the hashes on every request.
 */
export function createSession(user: string, pass: string): string {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  return `${expires}:${user}:${pass}`;
}

/**
 * Verified cookies, remembered for the life of the server instance.
 *
 * Checking the session means running the same 210,000-round derivation the
 * sign-in does, which measured around 900ms — paid on every page view, for a
 * page someone reads for several minutes. The cache turns that into a one-off
 * cost per instance.
 *
 * Only positive results are stored, and only against the exact cookie string,
 * so this can never admit a cookie that has not already been verified in full.
 * It is bounded so a flood of distinct cookies cannot grow it without limit,
 * and entries expire so a credential change is picked up rather than being
 * remembered until the instance recycles.
 */
const verified = new Map<string, { user: string; until: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_LIMIT = 32;

function cacheGet(token: string): string | null {
  const hit = verified.get(token);
  if (!hit) return null;
  if (hit.until < Date.now()) {
    verified.delete(token);
    return null;
  }
  return hit.user;
}

function cacheSet(token: string, user: string): void {
  if (verified.size >= CACHE_LIMIT) {
    const oldest = verified.keys().next().value;
    if (oldest !== undefined) verified.delete(oldest);
  }
  verified.set(token, { user, until: Date.now() + CACHE_TTL_MS });
}

/** Returns the signed-in user, or null if the cookie is absent, wrong or stale. */
export async function readSession(token: string | undefined): Promise<string | null> {
  if (!token) return null;

  const cached = cacheGet(token);
  if (cached) return cached;

  const firstColon = token.indexOf(":");
  const secondColon = token.indexOf(":", firstColon + 1);
  if (firstColon < 1 || secondColon < 0) return null;

  const expires = Number(token.slice(0, firstColon));
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  const user = token.slice(firstColon + 1, secondColon);
  const pass = token.slice(secondColon + 1);

  const record = await verifyCredentials(user, pass);
  if (!record) return null;

  cacheSet(token, record.user);
  return record.user;
}

export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = SESSION_HOURS * 60 * 60;

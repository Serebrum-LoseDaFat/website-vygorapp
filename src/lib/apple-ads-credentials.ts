/**
 * Sign-in credentials for the private Apple Ads guide.
 *
 * GENERATED — do not edit by hand. Regenerate with:
 *   node scripts/hash-credentials.mjs name:password [name:password ...]
 *
 * Only a random salt and a PBKDF2 hash are stored, so this file can live in the
 * repository without the passwords living there too. Verification derives the
 * same hash from what someone types and compares the result.
 *
 * This is safe to commit. It is NOT a reason to choose a weak password: anyone
 * with the file can test guesses offline, and the iteration count only makes
 * each guess expensive. A password that can be guessed from the company name
 * gives no protection at all.
 */

export type StoredCredential = {
  readonly user: string;
  readonly salt: string;
  readonly hash: string;
};

/** PBKDF2-HMAC-SHA256 rounds. Must match whatever generated the hashes below. */
export const PBKDF2_ITERATIONS = 210000;

/** Derived key length in bytes. */
export const PBKDF2_KEY_BYTES = 32;

export const CREDENTIALS: readonly StoredCredential[] = [
  { user: "krishna", salt: "xyVKsj00_L6sOIgD0u9-0A", hash: "K15YRjBWXbN5LjYyp33k3SkipmHWPoYmvZoRl2ptZzc" },
  { user: "hajira", salt: "-102FQwLmXBCqBGOdIE3zQ", hash: "XB7h_rj3iYni7IwjGW3z0C-M7lBntbUmPWkbiQ9yV_A" },
];

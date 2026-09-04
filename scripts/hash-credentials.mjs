/**
 * Generates src/lib/apple-ads-credentials.ts from plaintext passwords.
 *
 * Run it, paste in the passwords, commit the generated file. The plaintext is
 * never written anywhere — only a per-user random salt and a PBKDF2 hash, which
 * is what makes the file safe to keep in Git.
 *
 *   node scripts/hash-credentials.mjs krishna:<password> hajira:<password>
 *
 * Passing the passwords as arguments puts them in your shell history. Clear it
 * afterwards, or run the command with a leading space if your shell is set to
 * skip those.
 *
 * WHAT A HASH DOES AND DOES NOT BUY YOU
 *
 * It stops someone reading the repository from seeing the password directly.
 * It does NOT stop them guessing it: they have the salt and the hash, so they
 * can test candidate passwords offline as fast as their hardware allows. PBKDF2
 * at this iteration count makes each guess cost real time, which is what turns
 * a strong password into an impractical target — but a password anyone could
 * guess from the company name falls on the first attempt no matter how it is
 * hashed.
 */
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";

/** OWASP's current floor for PBKDF2-HMAC-SHA256. */
const ITERATIONS = 210_000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;

const pairs = process.argv.slice(2);
if (pairs.length === 0) {
  console.error("usage: node scripts/hash-credentials.mjs name:password [name:password ...]");
  process.exit(1);
}

const records = pairs.map((pair) => {
  const split = pair.indexOf(":");
  if (split < 1) throw new Error(`expected name:password, got "${pair.slice(0, 12)}..."`);
  const user = pair.slice(0, split).trim().toLowerCase();
  const password = pair.slice(split + 1);
  if (!password) throw new Error(`no password given for "${user}"`);

  const salt = randomBytes(SALT_LENGTH);
  const hash = pbkdf2Sync(password.normalize("NFKC"), salt, ITERATIONS, KEY_LENGTH, "sha256");
  return {
    user,
    salt: salt.toString("base64url"),
    hash: hash.toString("base64url"),
    length: password.length,
  };
});

const file = `/**
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
export const PBKDF2_ITERATIONS = ${ITERATIONS};

/** Derived key length in bytes. */
export const PBKDF2_KEY_BYTES = ${KEY_LENGTH};

export const CREDENTIALS: readonly StoredCredential[] = [
${records
  .map((r) => `  { user: ${JSON.stringify(r.user)}, salt: ${JSON.stringify(r.salt)}, hash: ${JSON.stringify(r.hash)} },`)
  .join("\n")}
];
`;

writeFileSync("src/lib/apple-ads-credentials.ts", file);

console.log("wrote src/lib/apple-ads-credentials.ts");
for (const r of records) {
  const strength = r.length >= 16 ? "ok" : r.length >= 12 ? "short" : "WEAK";
  console.log(`  ${r.user.padEnd(12)} ${String(r.length).padStart(2)} chars  ${strength}`);
}

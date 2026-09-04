# Apple Ads guide — restricted view

The Apple Ads master guide is published on the site but is not part of it. It is
reachable only by signing in at `vygor.app/apple-ads`.

**No password is stored anywhere in this repository.** Credentials are committed
as salted PBKDF2 hashes, which is why there is no environment variable to set in
Vercel — the site works as soon as it deploys.

> **Read this before relying on it.** Hashes stop someone who reads the
> repository from *seeing* the passwords. They do not stop that person
> *guessing* them: with the salt and hash in hand, candidates can be tested
> offline. The iteration count sets the price per guess. A password anyone could
> derive from the company name falls on the first attempt no matter how it is
> hashed — see [Choosing a password](#choosing-a-password).

---

## What and where

| | |
| --- | --- |
| URL | `https://www.vygor.app/apple-ads` |
| Who has access | Krishna and Hajira, one login each |
| Credentials | [`src/lib/apple-ads-credentials.ts`](../src/lib/apple-ads-credentials.ts) — generated, hashes only |
| Generator | [`scripts/hash-credentials.mjs`](../scripts/hash-credentials.mjs) |
| Auth logic | [`src/lib/apple-ads-auth.ts`](../src/lib/apple-ads-auth.ts) |
| The gate | [`src/middleware.ts`](../src/middleware.ts) |
| Sign-in page | [`src/app/apple-ads/sign-in/page.tsx`](../src/app/apple-ads/sign-in/page.tsx) |
| Form handler | [`src/app/apple-ads/sign-in/submit/route.ts`](../src/app/apple-ads/sign-in/submit/route.ts) |
| The guide | [`src/content/apple-ads-guide.html`](../src/content/apple-ads-guide.html) |

Nothing on the site links to it, it is absent from `sitemap.xml`, and the
response carries `X-Robots-Tag: noindex`. It is deliberately **absent from
`robots.txt`** too — naming the path in a public file would only advertise it.

---

## How signing in works

Without a session, `/apple-ads` is rewritten to a sign-in card asking for a name
and password. Sign in once and that browser stays signed in for twelve hours.

The sign-in page and the guide are **separate routes**. An unauthenticated
request never reaches the guide route, so no part of the document is in the
response. A single page that loaded the guide and hid it behind a form would
already have sent it, and anyone could read it from view-source.

### Why the cookie holds the credential

The session used to be a cookie signed with an HMAC keyed on the credential
list. That was sound while the list was a secret in the environment. It became
worthless once the list was committed: anyone reading the repository would hold
the signing key and could mint a valid cookie, walking straight past the form.

So there is no signing key. The cookie carries the credential, and every request
re-derives the hash and compares it. Forging it needs the password — the one
thing not in the repository. Revocation is immediate: regenerate the credentials
file and existing cookies stop verifying.

Verifying costs a full PBKDF2 derivation, measured at roughly 900ms. Repeat
verifications are cached in memory per server instance for five minutes, which
takes page views down to about 30ms; only positive results are cached, keyed on
the exact cookie, so it can never admit something not already verified in full.

The cookie is `HttpOnly`, `SameSite=Lax`, scoped to `/apple-ads`, and `Secure`
over HTTPS.

Failures never say whether the name or the password was wrong, because that
reveals which names exist, and carry a fixed delay — with no datastore there is
no attempt counter, and a delay costs an automated run far more than someone
who mistypes.

---

## Adding, changing or removing someone

Run the generator with every person who should have access, then commit:

```bash
node scripts/hash-credentials.mjs krishna:PASSWORD hajira:PASSWORD
```

It rewrites `src/lib/apple-ads-credentials.ts` with a fresh random salt and hash
per person. Anyone left out of the command loses access; anyone added gains it.
Deploy and it takes effect — no Vercel variable, no dashboard step.

The passwords appear in your shell history. Clear it afterwards, or run the
command with a leading space if your shell is configured to skip those lines.

---

## Choosing a password

This matters more here than in a normal system, because the hash is public.

An attacker with the repository can test guesses offline at whatever rate their
hardware allows. PBKDF2 at 210,000 rounds makes each guess cost real time, which
is what makes a long unpredictable password impractical to attack. It does
nothing for a predictable one: `name@company.domain` is among the first things
any human or wordlist would try.

If the guide's contents matter, use something that could not be derived from
the company, the product or the person. A few unrelated words joined together is
both stronger and easier to type than a short string with substitutions.

---

## The repository must be private

At the time of writing the repository was **public**, which means
`src/content/apple-ads-guide.html` was downloadable by anyone with no sign-in at
all — the login guards the route, not the file sitting beside it in Git.

Check under **Settings → General → Change visibility**. If the guide's contents
are sensitive, the sign-in form is not doing the job it looks like it is doing
while the repository is open.

---

## Updating the guide

Replace [`src/content/apple-ads-guide.html`](../src/content/apple-ads-guide.html)
and deploy. It is a complete standalone HTML document — its own styles and
fonts, no scripts — served as-is rather than rendered inside the site layout.

Keep it in `src/content/`. Anything in `public/` is served straight from the CDN
at its own URL, which would hand the guide out to anyone who guessed the
filename regardless of the sign-in.

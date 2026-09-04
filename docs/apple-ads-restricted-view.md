# Apple Ads guide — restricted view

The Apple Ads master guide is published on the site but is not part of it. It is
reachable only by signing in, and only for people on the credential list.

**No password appears in this file, or anywhere else in this repository.** They
live in one environment variable in Vercel. Writing them here would mean anyone
who can read the repo — today, or after any future access change — can read the
guide, which would undo the point of gating it.

---

## What and where

| | |
| --- | --- |
| URL | `https://www.vygor.app/apple-ads` |
| Who has access | Krishna and Hajira, one login each |
| Guide content | [`src/content/apple-ads-guide.html`](../src/content/apple-ads-guide.html) |
| The gate | [`src/middleware.ts`](../src/middleware.ts) |
| Sign-in page | [`src/app/apple-ads/sign-in/page.tsx`](../src/app/apple-ads/sign-in/page.tsx) |
| Form handler | [`src/app/apple-ads/sign-in/submit/route.ts`](../src/app/apple-ads/sign-in/submit/route.ts) |
| Session logic | [`src/lib/apple-ads-auth.ts`](../src/lib/apple-ads-auth.ts) |
| The guide route | [`src/app/apple-ads/route.ts`](../src/app/apple-ads/route.ts) |

It is deliberately invisible: nothing on the site links to it, it is absent from
`sitemap.xml`, and the response carries `X-Robots-Tag: noindex`. It is also
deliberately **absent from `robots.txt`** — naming the path in a public file
would only advertise that it exists.

---

## How signing in works

Go to `vygor.app/apple-ads`. Without a session you get a Vygor-styled card
asking for a name and password. Sign in once and that browser stays signed in
for twelve hours.

The sign-in page and the guide are **separate routes**. An unauthenticated
request is rewritten to the sign-in page, so the guide route never executes and
no part of the document is in the response. That distinction is the whole point:
a single page that loaded the guide and hid it behind a form would already have
sent it, and anyone could read it from view-source or the network tab without
typing anything.

The session cookie is **signed**, not merely set. It carries
`user.expiry.signature`, where the signature is an HMAC computed on the server.
A cookie that only said "signed in" could be typed into dev tools by anyone;
this one cannot be produced without the key. Verified — a forged cookie is
rejected and returns the form.

The cookie is `HttpOnly`, `SameSite=Lax`, scoped to `/apple-ads`, and `Secure`
over HTTPS, so page scripts cannot read it and it is not sent anywhere else.

The form never says whether the name or the password was wrong, because that
tells someone probing which names exist. There is a short delay on every
failure: with no datastore there is no attempt counter to keep, and a delay
costs an automated run far more than it costs someone who mistypes.

---

## Adding, changing or removing someone

Credentials live in `APPLE_ADS_USERS` as comma-separated `name:password` pairs.
Names are case-insensitive.

```
APPLE_ADS_USERS=krishna:SOME-PASSWORD,hajira:ANOTHER-PASSWORD
```

- **Add** someone: append `,name:password`, redeploy, tell them privately.
- **Remove** someone: delete their pair, redeploy.
- **Change** a password: edit the text after that person's colon, redeploy.

All of these need a **redeploy** — environment variables are read at build time.

One deliberate side effect: this variable also derives the session signing key,
so any edit signs **everyone** out. That is what makes removing access take
effect immediately rather than leaving a live session behind.

Two constraints: avoid commas and colons inside a password, because those are
the separators; and never rename the variable to anything starting
`NEXT_PUBLIC_`, because that prefix inlines the value into the JavaScript sent
to every visitor.

### If the variable is missing

The guard still rewrites to the sign-in page and the form rejects every attempt,
so a forgotten variable locks the guide rather than opening it. Earlier in this
project an unset variable silently removed every App Store badge from
production; the same class of mistake here would leak the guide, so the safe
direction is to refuse.

---

## What this is, and what it is not

A password is a shared secret: whoever has it has access, and it is only as
strong as the words chosen. There is no second factor and no account lockout, so
the password itself is doing all the work — a long passphrase is worth much more
here than a short one with a number on the end.

The upgrade, when the setup cost is worth paying, is **Google sign-in with an
email allowlist**: no password to choose or leak, access tied to accounts that
already carry their own two-factor protection, and adding someone becomes adding
an email. It needs a one-time Google OAuth app, which is the only reason it was
not done first.

---

## Updating the guide

Replace [`src/content/apple-ads-guide.html`](../src/content/apple-ads-guide.html)
and deploy. It is a complete standalone HTML document — its own styles, its own
fonts, no scripts — served as-is rather than rendered inside the site layout, so
it does not need to match the rest of the site.

Keep it in `src/content/`. Anything in `public/` is served straight from the CDN
at its own URL, which would hand the guide out to anyone who guessed the
filename regardless of the gate.

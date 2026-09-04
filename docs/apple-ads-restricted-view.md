# Apple Ads guide — restricted view

The Apple Ads master guide is published on the site but is not part of it. It is
reachable only by typing the URL, and only after signing in.

**No password appears in this file, or anywhere else in this repository.** They
live in one environment variable in Vercel. Writing them here would mean anyone
who can read the repo — today, or after any future access change — can read the
guide, which would undo the whole point of putting a login in front of it.

---

## What and where

| | |
| --- | --- |
| URL | `https://www.vygor.app/apple-ads` |
| Who has access | Krishna and Hajira, one login each |
| Guide content | [`src/content/apple-ads-guide.html`](../src/content/apple-ads-guide.html) |
| The gate | [`src/middleware.ts`](../src/middleware.ts) |
| The route | [`src/app/apple-ads/route.ts`](../src/app/apple-ads/route.ts) |

It is deliberately invisible: nothing on the site links to it, it is absent from
`sitemap.xml`, and the response carries `X-Robots-Tag: noindex`. It is also
deliberately **absent from `robots.txt`** — an unauthenticated request already
gets `401` so it cannot be indexed, and naming the path in a public file would
only advertise that it exists.

---

## How the login works

Access is checked in middleware, which runs on the server **before** the page is
produced. An unauthenticated request never receives the document.

This matters more than it sounds. A password form built into the page would be
decorative: the guide would already be inside the response by the time the form
appeared on screen, so anyone could read it from view-source or the browser's
network tab without typing anything. The check has to happen before the content
is sent, which is why it is middleware and not a component.

What you see is the browser's own sign-in dialog rather than a Vygor-styled
page. That is the trade for it being genuinely secure with very little code. It
has no "sign out" button — closing the browser clears it.

---

## Setting or changing a password

Credentials come from a single environment variable, `APPLE_ADS_USERS`, holding
comma-separated `user:password` pairs:

```
APPLE_ADS_USERS=krishna:SOME-PASSWORD,hajira:ANOTHER-PASSWORD
```

To change one:

1. Vercel → the `website-vygorapp` project → **Settings → Environment Variables**
2. Edit `APPLE_ADS_USERS`, changing only the password after that person's colon
3. Save, then **Redeploy** — environment variables are read at build time, so the
   change does not take effect until the next deployment
4. Delete the old value from wherever it was shared

Two constraints on the passwords themselves: avoid commas and colons, because
those are the separators; and do not rename the variable to anything beginning
`NEXT_PUBLIC_`, because that prefix inlines the value into the JavaScript sent
to every visitor.

### Why there is no "change your own password" screen

Letting someone set their own password requires somewhere to keep the new one.
This site is a static Next.js build on Vercel: there is no database, and the
filesystem a deployed function sees is read-only and thrown away after each
request. There is nowhere for a new password to be written.

A change-password form could be built, but it needs a datastore behind it —
Vercel KV or Postgres — plus password hashing, a real session cookie, and a
login screen to replace the browser dialog. That is a reasonable thing to build
if this grows into a proper internal area for a team. For two people reading one
document, editing one environment variable is less to maintain and less to get
wrong.

What must **not** be built is a form that keeps the new password in the browser
— in `localStorage`, or a cookie the page sets itself. That would only apply to
one browser, would not stop anyone else, and would leave everyone believing the
password had changed when it had not.

---

## If the variable is missing

The route **fails closed**: with `APPLE_ADS_USERS` unset or empty, `/apple-ads`
returns `503` and serves nothing. It does not fall back to open access.

This is deliberate. Earlier in this project an unset environment variable made
every App Store badge, the "For Business" link and both social icons disappear
from production silently — no error, no failed build. The same class of mistake
here would leak the guide instead of hiding a button, so the safe direction is to
break rather than open.

---

## Updating the guide

Replace [`src/content/apple-ads-guide.html`](../src/content/apple-ads-guide.html)
and deploy. It is a complete standalone HTML document — its own styles, its own
fonts, no scripts — and it is served as-is rather than rendered inside the site
layout, so it does not need to match the rest of the site.

Keep it in `src/content/`. Anything placed in `public/` is served straight from
the CDN at its own URL, which would hand the guide out to anyone who guessed the
filename regardless of the login.

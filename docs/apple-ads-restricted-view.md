# Apple Ads guide — restricted view

The Apple Ads master guide is published on the site but is not part of it. It is
reachable only by a personal link, and only for people whose key is on the list.

**No key appears in this file, or anywhere else in this repository.** They live
in one environment variable in Vercel. Writing them here would mean anyone who
can read the repo — today, or after any future access change — can read the
guide, which would undo the point of gating it.

---

## What and where

| | |
| --- | --- |
| URL | `https://www.vygor.app/apple-ads?k=<your key>` |
| Who has access | Krishna and Hajira, one key each |
| Guide content | [`src/content/apple-ads-guide.html`](../src/content/apple-ads-guide.html) |
| The gate | [`src/middleware.ts`](../src/middleware.ts) |
| The route | [`src/app/apple-ads/route.ts`](../src/app/apple-ads/route.ts) |

It is deliberately invisible: nothing on the site links to it, it is absent from
`sitemap.xml`, and the response carries `X-Robots-Tag: noindex`. It is also
deliberately **absent from `robots.txt`** — naming the path in a public file
would only advertise that it exists.

---

## How access works

Open your link once. The middleware checks the key, sets an httpOnly cookie, and
redirects you to the clean `/apple-ads`. From then on that browser is admitted
without the key, for thirty days.

The redirect is the point. After the first visit the key is out of the address
bar, so it does not turn up in a screenshot, in anything pasted from the address
bar, or in the `Referer` header sent to the Google Fonts request the guide makes.
The cookie is `HttpOnly`, `SameSite=Lax`, scoped to `/apple-ads`, and `Secure`
over HTTPS — so page scripts cannot read it and it is not sent anywhere else.

Bookmark the **full link with the key**, not the clean URL. When the cookie
expires the clean URL alone will return 404.

### Everything invalid returns 404

No key, a wrong key, a revoked key, or no keys configured at all — all return an
ordinary 404, the same as any other unknown URL. There is no login screen to
show, so there is nothing to gain by confirming the page exists. Someone probing
for it learns nothing.

The trade: a misconfiguration also looks like a 404. **If a correct bookmark
returns 404, check `APPLE_ADS_KEYS` in Vercel before suspecting the key.**

---

## Adding, changing or removing someone

Keys live in `APPLE_ADS_KEYS` as comma-separated `name:key` pairs. The name is
only so a key can be matched to a person when revoking; nobody ever types it.

```
APPLE_ADS_KEYS=krishna:<key>,hajira:<key>
```

Generate a key:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

That is 192 bits of randomness — not guessable, and not worth trying to brute
force.

To **add** someone: generate a key, append `,name:key` to the variable, redeploy,
send them their link privately.

To **remove** someone: delete their pair, redeploy. Their cookie stops working on
the next request — the cookie is re-checked against the list every time rather
than being independently valid, so there is nothing to wait out.

To **rotate** a key: replace that person's value and send the new link. Only
that person is affected, which is the main advantage over a shared password.

All of these need a **redeploy** — environment variables are read at build time.

Two constraints: avoid commas and colons inside a key, because those are the
separators; and never rename the variable to anything starting `NEXT_PUBLIC_`,
because that prefix inlines the value into the JavaScript sent to every visitor.

---

## What this is, and what it is not

Possession of the link is access. There is no second factor, so anyone who
receives a key can read the guide — send them privately, and not in a group
chat that other people can scroll back through.

Compared with the short shared password this replaced, it is stronger in the
ways that matter here: the keys cannot be guessed, and each person can be
revoked without disturbing anyone else.

It is weaker than a real sign-in. The upgrade, when the setup cost is worth
paying, is **Google sign-in with an email allowlist**: no key to leak at all,
access tied to accounts that already have their own two-factor protection, and
adding someone becomes adding an email rather than issuing a secret. That needs
a one-time Google OAuth app, which is the only reason it was not done first.

---

## Updating the guide

Replace [`src/content/apple-ads-guide.html`](../src/content/apple-ads-guide.html)
and deploy. It is a complete standalone HTML document — its own styles, its own
fonts, no scripts — served as-is rather than rendered inside the site layout, so
it does not need to match the rest of the site.

Keep it in `src/content/`. Anything in `public/` is served straight from the CDN
at its own URL, which would hand the guide out to anyone who guessed the
filename regardless of the gate.

# Tools section

Free calculators published under `/tools`, built to be found in search and used
as a lead-generation entry point into the app.

## The rule

**Each tool's HTML document is served byte-for-byte. Do not edit it, reformat
it, prettify it, or rebuild it as a React page.**

The documents are supplied finished and SEO-optimised for one exact URL. Each
one carries its own `<title>`, meta description, canonical, Open Graph and
Twitter tags, a JSON-LD block, its own stylesheet and its own script. Rendering
one through the app router would mean re-expressing all of that in Next's
metadata API and re-typing the markup as JSX — a rewrite, and every step of it a
chance to drift from the optimised original.

So a tool is a route handler that reads its file and returns it unchanged.
Nothing parses or edits it. If it needs to change, the file changes.

## Layout

| | |
| --- | --- |
| Directory page | [`src/app/tools/page.tsx`](../src/app/tools/page.tsx) — the only part of `/tools` in the site's design system |
| Directory copy | [`src/content/tools.ts`](../src/content/tools.ts) |
| Tool documents | `src/content/tools/<slug>.html` |
| Tool routes | `src/app/tools/<slug>/route.ts` |
| Social images | `public/tools/<slug>/og-image.png` |
| OG card sources | `src/content/tools/<slug>-og-card.html` |

Documents live in `src/content/tools/`, **not** `public/`. A copy in `public/`
would also be served at `/tools/<slug>.html` — a second URL with the same
content, competing with the canonical one in search.

## Adding a tool

1. Drop the document in `src/content/tools/<slug>.html`, unchanged.
2. Copy `src/app/tools/weight-loss-calculator/route.ts` to
   `src/app/tools/<slug>/route.ts` and change the filename it reads.
3. Add the slug to `outputFileTracingIncludes` in
   [`next.config.ts`](../next.config.ts). Without this the file is missing from
   the deployed function and the route 500s in production — it is read from
   disk, so tracing cannot infer it.
4. Add an entry to `tools` in [`src/content/tools.ts`](../src/content/tools.ts).
   The directory page, the footer group and the sitemap all read from that array,
   so nothing else needs touching.
5. If the document references an `og-image.png`, generate it (below).

## Regenerating a social image

The `og-card-source` files are a 1200×630 HTML card. Render one to PNG with
headless Chrome:

```bash
chrome --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=15000 \
  --screenshot="public/tools/<slug>/og-image.png" \
  "file:///absolute/path/to/src/content/tools/<slug>-og-card.html"
```

The card pulls the logo and phone screenshot from the live site over HTTPS, so
this needs a network connection and the site has to be up. Check the result is
1200×630 and that both images actually rendered before committing it.

## Known URL inconsistency

The weight loss calculator's own canonical tag is
`https://vygor.app/tools/weight-loss-calculator/` — non-`www`, with a trailing
slash. The site serves `https://www.vygor.app/tools/weight-loss-calculator` —
`www`, no trailing slash — and that is what `sitemap.xml` lists.

Both differences resolve by redirect (the trailing slash 308s, and the apex
domain redirects to `www`), and search engines follow redirects to consolidate,
so this is a wart rather than a break. Fixing it properly means editing the
supplied file, which is deliberately not done here. Worth aligning the next time
a document is supplied.

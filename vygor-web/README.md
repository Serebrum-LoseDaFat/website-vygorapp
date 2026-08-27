# Vygor — consumer website

A consumer-first marketing site for the Vygor wellness app. Next.js 15 (App
Router) · React 19 · TypeScript · Tailwind CSS v4.

```bash
npm install
npm run assets   # regenerate web images from the source art (already committed)
npm run dev      # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config) |
| `npm run assets` | Re-encodes source screenshots + logo into `public/` |

---

## Connect it up

Everything that points off-site lives in `src/lib/config.ts` and is driven by
environment variables. Copy `.env.example` to `.env.local` and fill in what you
have. **A blank value is not a broken link — the control hides itself.** Nothing
in the UI hardcodes an external URL, and there are no `href="#"` placeholders.

Three things are deliberately switched off right now:

| Variable | Status | Effect while blank |
| --- | --- | --- |
| `NEXT_PUBLIC_PLAY_URL` | No Android build exists | Google Play badge is not rendered anywhere |
| `NEXT_PUBLIC_LOGIN_URL` | No web sign-in exists | "Log In" is absent from the nav |
| `NEXT_PUBLIC_INSTAGRAM_URL` / `_TIKTOK_URL` | Set | Footer social icons (LinkedIn deliberately absent — consumer site) |

Set any of them and the corresponding UI appears on the next build. No component
changes needed.

### Contact form

The `#contact` section posts to `POST /api/contact`. Delivery is pluggable —
set **one** of:

- `RESEND_API_KEY` (+ `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) — sends email
- `CONTACT_WEBHOOK_URL` — POSTs JSON to Zapier / Make / Slack / a CRM

With neither set the endpoint returns **503** and the form tells the visitor to
email `partners@vygor.health` instead. It never reports a success it did not
achieve. Behaviour is covered end to end: 200 on delivery, 422 with per-field
errors, 400 on malformed JSON, 503 when unconfigured, 502 when the provider
fails, and a honeypot field that silently absorbs bots.

### Pricing figures

`pricing.rows` in `src/content/site.ts` names real competitors and their
published annual list prices, so the total is checkable. **They were looked up
in August 2026 and will drift** — re-check before a campaign. The section
carries that caveat visibly rather than in a footnote.

---

## Content

Copy and data are separated from components so non-developers can edit them.

- `src/content/site.ts` — every string on the homepage
- `src/content/testimonials.ts` — **empty by default**, see below
- `src/content/screens.ts` — typed accessor + alt text for the app screenshots
- `src/content/screens.generated.json` — written by `npm run assets`, do not edit

### Page structure

Hero → **six tools** (click-to-switch, `#features`) → Why choose Vygor → Less
juggling → How it works (`#how-it-works`) → a day with Vygor (filmstrip) →
**Why AI / hyper-personalization** (`#why-ai`) → editorial break → reviews
(hidden) → **Pricing** (`#pricing`) → FAQ (`#faq`) → **Contact** (`#contact`) →
one closing CTA.

Nav and footer both link the same six anchors. There is no `/for-business`
route: "Partner with us" and both legal pages point at the existing
vygor.health site rather than being rebuilt here.

The only call to action anywhere is Apple's App Store badge. "Get Vygor" and a
web "Log In" were removed — neither had a destination that wasn't the store
listing, and two differently-worded buttons to the same place is noise.

There is exactly **one** switcher on the page. "Your whole wellness journey, in
one view" is a static row showing all four screens at once — it was a second
tab widget, which duplicated the interaction directly above it and, more
awkwardly, promised "one view" while showing one screen at a time. Below `lg`
the row becomes a scroll-snapped filmstrip. No JavaScript.

The hero carries a single phone. A second screen beside it competed with the
home screen for attention without adding information.

The six tools — AI Dietitian, AI Recipes, AI Macro Tracker, AI Trainer,
Contests and Detailed Analytics — live in `AiModules.tsx`. Selecting a panel
swaps the device; it is a vertical ARIA tabs widget, click and keyboard only
(not hover, which would strobe every screen as the pointer travelled down).

Headings are written for one reader, described at the top of
`src/content/site.ts`: 35–55, US, working and time-poor, overweight by BMI,
often prediabetic, has quit a tracking app before. That profile is why the
feature heading is "Your dietitian, trainer and coach — without the
appointments" rather than a count of AI systems — the reader does not care how
many models are involved, only who is now doing the deciding.

There is exactly **one** closing call to action. An earlier build had three
stacked at the end of the page, which read as nagging rather than converting.
The closing panel also recaps the five AI systems as compact tiles — it is the
last thing read before deciding, and the panel was otherwise mostly empty.

### Reviews are switched off, on purpose

`testimonials.ts` exports an empty array, so the Reviews section, its nav link
and its `Review` structured data do not render at all. At build time Vygor's App
Store listing showed **one rating and no written review**, and publishing an
invented quote would be a fabricated endorsement.

Paste real reviews into that array and the whole section turns itself on. The
file has a worked example in its docblock.

For the same reason the statement band under the hero is a **single line and
nothing else**. It previously carried four supporting points, but they were
generic enough to sit on any wellness app's homepage. When there is real review
volume behind it, that band is the right place for a rating.

OS version numbers are also absent everywhere (copy, FAQ and JSON-LD) pending
confirmation of the actual minimums.

---

## Assets

Source art lives one directory up and is never modified. `npm run assets` reads
it and writes optimised files into `public/`. Two kinds of product image:

- **screens** — full screenshots exported at 1080px (plus 540px), shown inside
  the CSS `PhoneFrame`.
- **highlights** (`h-*`) — high-resolution crops of a region of one of those
  screens, floated outside the bezel by `PhoneWithHighlight` so the eye lands
  on the feature being described. Crop rectangles live in
  `scripts/build-assets.mjs` in the original 1290x2796 coordinate space.

### The hero is two complete phones

`HeroPhones.tsx` shows the home dashboard (primary) beside the contest board
(secondary, smaller, set back and lower, ~11% overlapped). It replaced a single
phone with cropped UI cards floated over it.

That approach was abandoned rather than tuned again. A crop of a screenshot
placed back over the same screenshot can only ever be approximately aligned, it
leaves the original visible so the same UI appears twice, and it covers the
screen it is meant to sell. Two complete assets have no alignment to get wrong.

**Product screenshots are never rotated, mirrored or put into perspective.** No
`scaleX(-1)`, no `rotateX/rotateY`, no CSS `perspective`. The only motion on a
phone is a vertical drift, which cannot change orientation. A `rotateY` tilt
that used to sit on the "Less juggling" phone was removed for the same reason.

**`IMG_9973.PNG` is stored 180° rotated** while its EXIF claims "normal", so
nothing downstream corrected it and the home screen rendered upside down
everywhere it appeared. It is fixed once at ingest via `ROTATE_180` in the asset
pipeline — never with a compensating CSS transform, which would break the moment
the asset is reused somewhere that does not know about it. Every other
screenshot in the folder was checked and is correctly oriented.

### The features section uses hand-composed product shots

`Images- pop up edits/Split 1–6.png` are finished 1290×2796 artboards — a
complete phone with its pop-out card already laid out over it, on a pure-white
ground. `AiModules` renders them **bare**: they carry their own device frame, so
wrapping them in `PhoneFrame` would double the bezel, and no transform of any
kind is applied.

They replaced DOM overlays positioned over a screenshot. Those could never be
better than approximately aligned; the composition is now settled in the source
artwork, so there is nothing left for code to align.

**The crops are hand-measured on purpose.** The phone is the same size in all
six (its dark bezel measures 2225px tall in every file) but sits at slightly
different x/y positions, because each pop-out pushes it around the canvas.
`COMPOSITES` crops every file to one 1274×2264 window *registered on the bezel*,
padding with white where a window falls outside the source. Verified result:
bezel centre `x=627` and top `y=19` in all six, and the rendered box is identical
across all six tabs — so the device never jumps when the selection changes.

**The white ground is kept, not keyed out.** The section sits on pure white so it
blends invisibly, and keeping it avoids the halos that alpha extraction leaves
around soft drop shadows. That is also why the phone column has no glow behind
it any more — a white rectangle over a cyan blur reads as a bug. If the section
background ever changes, these need re-exporting with transparency.

### Two rules that keep the cards aligned

**1. A card sits over the region it was cropped from.** `PhoneWithHighlight`
derives the card's position from the crop's own box (stored as fractions in the
manifest), so alignment is geometry, not hand-tuning. An earlier version floated
cards off to one side, which left the original visible underneath — the rings,
tabs and contest card each appeared *twice*, a few pixels apart, and read as a
rendering fault. Overhang is symmetric, a few percent each side.

**2. Generated filenames are content-hashed.** `/app/*` is served
`immutable, max-age=31536000` and Next caches optimized variants on disk, both
keyed by URL. With stable filenames, re-cropping an asset kept serving the old
bytes — a card would render at the *previous* crop's aspect ratio and no amount
of rebuilding fixed it. Hashing makes new bytes a new URL, so the long cache
lifetime is safe. `npm run assets` also clears `.next/cache/images`.

### The one soft image

`h-logging` (the hand photographing a meal, above the Photo / Gallery / Barcode
/ Type-it row) is cropped from `4._AI_Macro_Tracker-removebg-preview.png`,
because that composition does not exist in the full-resolution screenshot
folder. The mockup is 339px wide, so this card is **upscaled and visibly softer
than everything else**. To fix: drop the full-resolution "Macro Tracker"
screenshot into `App screenshots/`, move the entry from `LOWRES_HIGHLIGHT` into
`HIGHLIGHTS`, and re-run `npm run assets`.

### Why the supplied mockups are no longer used

The `-removebg-preview` mockups were 339px wide and rendered at ~330 CSS px, so
on a retina screen they carried **about half** the pixels needed and looked
soft. Upscaling adds no detail, so the same popped-out composition is now
rebuilt from sharp parts: a vector CSS bezel, a 1080px screen export, and a
1080px crop for the card. The srcset now reaches 1080w, so a 2x display gets
2x+ where it previously got 0.5x.

Angled shots are CSS 3D transforms on a sharp frame (hero, "Less juggling")
rather than the supplied 512px angled render, for the same reason.

Date strips are painted out of screens that carry them (`SCREEN_MASKS`), filled
with the flat colour sampled just below the band — 2026 dates read as stale on a
marketing page and they sit exactly where the eye lands first.

The contest card's participant photo is replaced with a drawn round avatar
(`AVATAR_SWAP`), not blurred: a blur still reads as "someone censored a face",
whereas a clean generic avatar reads as product UI.

Positioning and animation live on **separate** elements wherever a float is
combined with a centring translate — the float keyframes write `transform`, so
animating the positioned element would wipe the translate out.

`PhoneFrame` sets its width as an inline style, which a `w-*` class cannot
override. Pass `widthClass` (plus `sizes`) when the width must change at a
breakpoint; the hero phones do exactly that so neither screen becomes
unreadable at 375px.

`PhoneFrame` and `DeviceMockup` both set `relative` on their root so their own
absolutely-positioned parts have a containing block. **Do not pass `absolute`
in `className` to move one** — Tailwind emits `relative` after `absolute`, so
the override silently loses and the element stays in normal flow. Wrap it in
your own positioned `<div>` instead (see the fan in `DownloadCta`).

To swap or add one, edit `MOCKUPS`/`SCREENS` in `scripts/build-assets.mjs`, add
matching alt text in `src/content/screens.ts`, and re-run `npm run assets`.
`screen()` throws at build time on an unknown id rather than rendering nothing.

The App Store badge is Apple's official artwork as supplied, scaled only —
never recoloured or cropped.

**Excluded on purpose:** the contest leaderboard screenshots (`IMG_9958`,
`IMG_9959`) show multiple other users' names and photos, so they are not used.
The supplied Gamification mockup shows one participant card and was provided
for that section deliberately.

---

## Design system

The palette is sampled from the logo itself — cyan `#009CE4`, leaf `#84C054`,
rule grey `#787878` — and every pairing in `src/app/globals.css` was
contrast-checked, with the ratio recorded in a comment next to the token. Two
rules matter if you extend it:

- **Brand cyan `#009CE4` is a fill, never a white-text bed.** It only reaches
  3.05:1. Use `cyan-600` (4.78:1) or `cyan-700` (7.04:1) under white text.
- **Leaf green carries dark text only.** White on `leaf-500` is 2.18:1; ink on
  `leaf-500` is 8.12:1. `leaf-700`/`leaf-800` are the text-safe greens.

There are two gradients because one is not enough: `brand-gradient` for buttons
(white at full opacity clears AA on it) and `cta-gradient`, a step darker, for
the closing panel where the copy is translucent white.

The focus ring is two-tone — an inner white ring and an outer `cyan-700` ring —
because no single colour clears 3:1 against white, the tinted beds, the deep
navy *and* the gradients. It uses `box-shadow` so it inherits each element's
border radius, with a transparent `outline` as the Windows High Contrast
fallback.

Type is Plus Jakarta Sans, self-hosted via `next/font` (no external request, no
layout shift). Sizes are fluid `clamp()` values; nothing renders below 12px.

---

## Accessibility

Verified in-browser, not assumed:

- **Contrast:** 0 failures across the full rendered page, checked with a
  resolver that composites `oklab`/alpha colours and element-level opacity over
  the real painted background (taking the lightest gradient stop as worst case).
- **Target size:** 0 controls below 24×24 (WCAG 2.2 SC 2.5.8).
- **Keyboard:** both switchers are real ARIA tabs widgets (roving tabindex,
  arrow keys, Home/End) — the five AI systems vertically, the day-to-day tour
  horizontally. The mobile menu traps focus, closes on Escape, restores focus
  to its trigger and locks background scroll.
- **FAQ:** native `<details>`/`<summary>` — correct semantics for free, findable
  by in-page search, and working with JavaScript disabled.
- **Motion:** `prefers-reduced-motion` is honoured in three places — the global
  stylesheet, the FAQ height transition, and `Reveal`, which skips its observer
  and mounts in the final state.
- **No-JS:** scroll reveals start at `opacity: 0`, so a `<noscript>` block
  forces them visible rather than shipping a blank page.
- Pinch-zoom is left enabled (`maximumScale: 5`).

## SEO

Title, description, canonical, Open Graph and Twitter cards, a generated
1200×630 OG image, `sitemap.xml`, `robots.txt`, and JSON-LD for
`Organization` / `WebSite` / `MobileApplication` / `FAQPage`.

The structured data deliberately omits `aggregateRating` — see the reviews note
above.

## Performance

120 kB First Load JS. No animation library: scroll reveals are one shared
`IntersectionObserver` plus CSS transitions on `opacity`/`transform` only, so
nothing animates layout properties. Images are lazy below the fold, the hero
phone is `priority`, and Next's image ladders are capped at 1080px because no
source asset is wider than 640.

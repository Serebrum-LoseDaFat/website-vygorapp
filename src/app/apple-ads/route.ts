import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Serves the Apple Ads master guide at /apple-ads.
 *
 * A route handler rather than a page, because the guide is a complete,
 * self-contained HTML document with its own typography and colour scheme.
 * Rendering it inside the site layout would wrap it in the Vygor header, footer
 * and fonts and fight its own stylesheet; returning it as its own document keeps
 * it exactly as written.
 *
 * The source lives in src/content, NOT in public/. Anything under public/ is
 * served straight from the CDN at its own URL, which would hand out the guide to
 * anyone who guessed the filename regardless of what middleware.ts says.
 *
 * Access is gated in middleware.ts, which runs before this handler.
 *
 * force-dynamic and no-store together keep the document off every cache: a
 * prerendered or CDN-cached copy of a protected page is a copy that can be
 * served without the request ever reaching the auth check.
 */

export const dynamic = "force-dynamic";

const guide = readFileSync(
  path.join(process.cwd(), "src/content/apple-ads-guide.html"),
  "utf8",
);

/**
 * A way out.
 *
 * Appended rather than edited into the document: the guide is supplied artwork
 * that gets replaced wholesale, and anything written into it would be lost on
 * the next update. It carries inline styles for the same reason — the guide has
 * its own stylesheet and no class of ours would survive a replacement either.
 *
 * Without this the only ways to end a session are waiting twelve hours or
 * clearing cookies, which is a poor answer on a shared or borrowed screen.
 */
const SIGN_OUT_LINK = `
<a href="/apple-ads/sign-out"
   style="position:fixed;top:14px;right:14px;z-index:2147483647;display:inline-flex;
          align-items:center;min-height:36px;padding:0 14px;border-radius:999px;
          background:rgba(255,255,255,.92);color:#241F16;border:1px solid rgba(36,31,22,.18);
          font:600 13px/1 system-ui,-apple-system,'Segoe UI',sans-serif;text-decoration:none;
          box-shadow:0 6px 18px -8px rgba(36,31,22,.5);backdrop-filter:blur(6px)">Sign out</a>`;

export function GET() {
  return new Response(guide + SIGN_OUT_LINK, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Belt and braces alongside robots.txt: a header travels with the
      // response even if a crawler never reads robots.
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      "Cache-Control": "private, no-store, max-age=0",
      "Referrer-Policy": "no-referrer",
    },
  });
}

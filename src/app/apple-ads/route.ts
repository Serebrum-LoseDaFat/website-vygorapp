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

export function GET() {
  return new Response(guide, {
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

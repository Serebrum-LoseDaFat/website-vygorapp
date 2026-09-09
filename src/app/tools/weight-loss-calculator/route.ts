import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Serves the Weight Loss Calculator at /tools/weight-loss-calculator.
 *
 * A route handler rather than a page, and that is the whole point: the file was
 * supplied finished and SEO-optimised for this exact URL, and it must reach the
 * browser byte-for-byte. It carries its own <title>, meta description,
 * canonical, Open Graph and Twitter tags, a WebApplication JSON-LD block, its
 * own stylesheet and its own script. Rendering it through the app router would
 * mean re-expressing all of that in Next's metadata API and re-typing the
 * markup as JSX — which is exactly the rewrite we were asked not to do, and
 * every step of it a chance to drift from the optimised original.
 *
 * So the document is returned verbatim. Nothing here reads, parses or edits it.
 * If it needs to change, the file changes.
 *
 * The source lives in src/content/tools, NOT in public/. A copy in public/
 * would also be served at /tools/weight-loss-calculator.html — a second URL
 * with the same content, competing with the canonical one in search.
 *
 * Read once at module load, so the disk is touched on cold start rather than
 * per request.
 */

const page = readFileSync(
  path.join(process.cwd(), "src/content/tools/weight-loss-calculator.html"),
  "utf8",
);

export function GET() {
  return new Response(page, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Static content, but revalidated: the tool is a lead-generation page
      // that will be edited, and a year-long immutable cache on the document
      // would leave stale copies in CDNs long after a fix shipped. A short
      // shared cache with a long stale window keeps it fast without that.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

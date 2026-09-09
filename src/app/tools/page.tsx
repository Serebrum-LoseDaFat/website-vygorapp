import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { DownloadCta } from "@/components/DownloadCta";
import { Activity, ArrowRight, Chart, Check, Shield, Utensils } from "@/components/Icons";
import { tools, toolsIntro, type ToolIcon } from "@/content/tools";
import { siteUrl } from "@/lib/config";

/**
 * The free tools directory.
 *
 * Its own route because the audience arrives differently from everyone else on
 * the site: not from an ad or a creator's bio, but from a search for a number
 * they want ("how many calories to lose weight"). They land on the tool itself,
 * use it, and this index is what tells them there is more than one. So it is
 * short and it is a list — the pitch belongs on the homepage.
 *
 * WHY THE CARDS LINK OUT TO SEPARATE DOCUMENTS
 *
 * Each tool is a finished, self-contained HTML document served verbatim by its
 * own route handler, with its own styles, script and SEO. This page is the only
 * part of /tools rendered in the site's design system, which is why the site
 * header and footer wrap this and not them. That is deliberate: the tools are
 * built to be optimised and shared as single pages, and re-expressing them as
 * React would put every one of those optimisations at risk of drifting.
 *
 * The closing panel is the same DownloadCta the homepage uses. A visitor who
 * just got a calorie target is the warmest audience the site has, and the honest
 * next step is the app that turns the target into meals — not a second, weaker
 * CTA written specially for this page.
 */

// The root layout applies a "%s — Vygor" template, so no suffix here.
const title = "Free Weight Loss Tools & Calculators";
const description =
  "Free Vygor tools: calculate your BMR, TDEE and daily calorie target, and see a realistic timeline to your goal weight. No signup, nothing stored.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/tools` },
  openGraph: { title, description, url: `${siteUrl}/tools`, type: "website" },
};

const icons: Record<ToolIcon, typeof Chart> = {
  chart: Chart,
  utensils: Utensils,
  activity: Activity,
};

export default function ToolsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-tint pb-16 pt-32 sm:pb-20 sm:pt-40">
        {/* Same soft wash as the other page heads, so /tools does not read as a
            different site. Decorative only. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_156_228/0.12),transparent)]" />
          <div className="absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(132_192_84/0.12),transparent)]" />
        </div>

        <div className="shell relative">
          <Reveal>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              {toolsIntro.kicker}
            </p>
            <h1 className="mt-4 max-w-3xl text-[length:var(--text-h1)]">{toolsIntro.title}</h1>
            <p className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {toolsIntro.lead}
            </p>
            <p className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[0.88rem] font-medium text-ink-2 shadow-soft ring-1 ring-line">
              <Shield size={17} className="shrink-0 text-leaf-700" />
              {toolsIntro.note}
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="tools-list-heading" className="bg-white py-16 sm:py-20">
        <div className="shell">
          <h2 id="tools-list-heading" className="sr-only">
            Available tools
          </h2>

          {/* A stack of full-width cards, not a multi-column grid. With one
              tool live, a two-up grid left the whole right half of the row
              empty, which reads as a layout that failed to load rather than as
              a directory. Each card splits internally instead, so it fills its
              row honestly at any count and the list simply grows downwards as
              tools are added. */}
          <ul className="flex flex-col gap-6">
            {tools.map((tool, i) => {
              const Icon = icons[tool.icon];
              const href = `/tools/${tool.slug}`;

              return (
                <Reveal as="li" key={tool.slug} delay={i * 70}>
                  {/* The whole card is one link. The heading holds the anchor
                      and an inset overlay stretches its hit area over the card,
                      so there is a single tab stop and a single accessible name
                      rather than a card wrapping a duplicate "Open" link. */}
                  <div className="group relative grid gap-8 rounded-3xl bg-white p-7 shadow-soft ring-1 ring-line transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[0_4px_10px_rgb(6_34_49/0.06),0_24px_50px_-16px_rgb(6_34_49/0.22)] hover:ring-cyan-600/40 focus-within:ring-2 focus-within:ring-cyan-700 sm:p-9 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
                    <div>
                      <span
                        aria-hidden="true"
                        className="inline-flex size-12 items-center justify-center rounded-2xl bg-mist text-cyan-700"
                      >
                        <Icon size={23} />
                      </span>

                      <h3 className="mt-6 text-[1.45rem] font-bold leading-snug text-ink">
                        <Link href={href} className="rounded outline-none">
                          {tool.name}
                          <span aria-hidden="true" className="absolute inset-0 rounded-3xl" />
                        </Link>
                      </h3>
                      <p className="mt-2 text-[1.05rem] font-semibold text-cyan-700">
                        {tool.tagline}
                      </p>
                      <p className="mt-4 max-w-xl leading-relaxed text-ink-2">{tool.blurb}</p>

                      {/* Decoration, not a control: the card's one link already
                          covers this area, and a second focusable element here
                          would be a tab stop leading to the same place. */}
                      <p
                        aria-hidden="true"
                        className="mt-7 inline-flex items-center gap-1.5 font-semibold text-cyan-700"
                      >
                        Open the tool
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                        />
                      </p>
                    </div>

                    {/* What you get back, on its own tinted panel. This is the
                        part that decides the click, so it is given equal weight
                        to the description rather than being a footnote under
                        it. */}
                    <div className="rounded-2xl bg-tint p-6 ring-1 ring-line">
                      <h4 className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
                        What you get
                      </h4>
                      <ul className="mt-4 flex flex-col gap-3">
                        {tool.outputs.map((output) => (
                          <li key={output} className="flex gap-2.5 text-[0.95rem] text-ink-2">
                            <Check size={18} className="mt-0.5 shrink-0 text-leaf-700" />
                            {output}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <DownloadCta />
    </>
  );
}

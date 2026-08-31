import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/Button";
import { StoreBadges } from "@/components/StoreBadges";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Check, Close, Plus, Sparkle, Instagram, Tiktok } from "@/components/Icons";
import {
  creatorsIntro,
  creatorBenefits,
  creatorProduct,
  creatorPractices,
  creatorCompliance,
  creatorSegments,
  creatorContact,
} from "@/content/creators";
import { partnersEmail, siteUrl } from "@/lib/config";

/**
 * The creator program page.
 *
 * Its own route rather than a homepage section. The homepage is written for a
 * consumer deciding whether to download; this is written for a creator deciding
 * what they may say on camera. Two thousand words of compliance rules in the
 * middle of a conversion page would serve neither.
 *
 * Order is deliberate and is a compliance decision, not a design one: product,
 * then craft, then the rules, and only then the per-niche angles. A creator who
 * skims to their own segment and stops has still scrolled past the prohibited
 * list on the way.
 */

// The root layout applies a "%s — Vygor" template, so this must NOT carry its
// own suffix or the tab reads "Creator program — Vygor — Vygor".
const title = "Creator program";
const description =
  "Brief for creators working with Vygor: how the app works, what makes short-form content land, the disclosure and claim rules every post must follow, and content angles by niche.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/creators` },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/creators`,
    type: "article",
  },
};

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
      {children}
    </p>
  );
}

/**
 * A platform pill that drifts beside the hero phone. Decoration, so it carries
 * no metrics — a follower count or an engagement figure here would be invented,
 * and the site does not publish numbers it cannot stand behind.
 */
function SocialChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[0.82rem] font-semibold text-ink shadow-[0_10px_30px_-12px_rgb(6_34_49/0.45)] ring-1 ring-line backdrop-blur-sm">
      <span className="text-cyan-700">{icon}</span>
      {label}
    </span>
  );
}

export default function CreatorsPage() {
  const mailto = `mailto:${partnersEmail}?subject=${encodeURIComponent("Vygor creator submission")}`;
  // Same split the homepage hero uses: everything before the accent renders
  // plain, the accent itself takes the brand gradient.
  const heroLead = creatorsIntro.title.slice(0, creatorsIntro.title.lastIndexOf(creatorsIntro.accent));

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden bg-tint pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_156_228/0.16),transparent)]" />
          <div className="absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(132_192_84/0.12),transparent)]" />
        </div>

        <div className="shell">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
            <Reveal>
              <div>
                <SectionKicker>{creatorsIntro.kicker}</SectionKicker>
                <h1 className="mt-3 text-[length:var(--text-h1)] text-ink">
                  {heroLead}
                  <span className="brand-text-gradient">{creatorsIntro.accent}</span>
                </h1>
                <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-ink-2">
                  {creatorsIntro.lead}
                </p>
                <p className="mt-4 text-[0.95rem] font-medium text-ink-3">{creatorsIntro.price}</p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <ButtonLink href={mailto} variant="primary" size="lg" withArrow>
                    Apply to the program
                  </ButtonLink>
                  {/* Out to the consumer site, not to "/" — a creator wants to
                      see what their audience will land on. */}
                  <ButtonLink href={siteUrl} variant="secondary" size="lg" external withArrow>
                    Visit vygor.app
                  </ButtonLink>
                </div>
              </div>
            </Reveal>

            {/* Phone with the contest screen — the one feature a creator can
                point their own audience at — and two platform chips drifting
                beside it.

                Only the chips move. The screenshot never rotates, tilts or
                drifts: product UI stays upright and unaltered, and the chips are
                our own decoration rather than cropped app pixels floated back
                over the screen they came from. Motion guidance says keep moving
                elements to one or two per view, so it is two, both slow and
                low-amplitude, and `float-slow` already switches itself off under
                prefers-reduced-motion. */}
            <Reveal delay={120} y={24}>
              <div className="relative mx-auto w-fit lg:ml-auto lg:mr-0">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 m-auto h-[70%] w-[85%] rounded-[50%] bg-cyan-500/18 blur-3xl"
                />

                <PhoneFrame id="contests" width={286} proportional priority />

                <div
                  className="float-slow absolute -left-4 top-[16%] sm:-left-10"
                  style={{ "--drift": "9px", "--float-duration": "8.5s" } as React.CSSProperties}
                >
                  <SocialChip icon={<Instagram size={16} />} label="@vygorapp" />
                </div>

                <div
                  className="float-slow absolute -right-3 bottom-[18%] sm:-right-8"
                  style={
                    {
                      "--drift": "7px",
                      "--float-duration": "11s",
                      "--float-delay": "-3s",
                    } as React.CSSProperties
                  }
                >
                  <SocialChip icon={<Tiktok size={16} />} label="@vygorapp" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- what you get ---------------- */}
      <section aria-labelledby="benefits-heading" className="bg-white py-20 sm:py-24">
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <SectionKicker>{creatorBenefits.kicker}</SectionKicker>
              <h2 id="benefits-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
                {creatorBenefits.title}
              </h2>
              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
                {creatorBenefits.lead}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {[...creatorBenefits.items, ...(creatorBenefits.commercial ? [creatorBenefits.commercial] : [])].map(
                (item) => (
                  <li
                    key={item.title}
                    className="rounded-2xl bg-tint p-6 ring-1 ring-line transition-shadow duration-200 hover:shadow-sm"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-white text-cyan-700 ring-1 ring-line">
                      <Sparkle size={16} />
                    </span>
                    <h3 className="mt-4 font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{item.body}</p>
                  </li>
                ),
              )}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- what you are promoting ---------------- */}
      <section aria-labelledby="product-heading" className="bg-white py-20 sm:py-24">
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <SectionKicker>The product</SectionKicker>
              <h2 id="product-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
                {creatorProduct.title}
              </h2>
              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
                {creatorProduct.lead}
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {creatorProduct.tools.map(([name, body]) => (
                <li key={name} className="border-t border-line pt-5">
                  <h3 className="font-semibold text-ink">{name}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- best practices ---------------- */}
      <section aria-labelledby="craft-heading" className="bg-tint py-20 sm:py-24">
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <SectionKicker>Best practice</SectionKicker>
              <h2 id="craft-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
                What makes a short-form video work.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {creatorPractices.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl bg-white p-6 ring-1 ring-line transition-shadow duration-200 hover:shadow-sm"
                >
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{item.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- compliance ---------------- */}
      {/* On the deep bed so it reads as the serious part of the page rather than
          one more card grid. This is the section with legal consequences. */}
      <section
        id="compliance"
        aria-labelledby="compliance-heading"
        className="grain scroll-mt-24 bg-deep py-20 text-white sm:py-24"
      >
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-aqua-300">
                Compliance
              </p>
              <h2 id="compliance-heading" className="mt-3 text-[length:var(--text-h2)]">
                {creatorCompliance.title}
              </h2>
              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-white/75">
                {creatorCompliance.lead}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal delay={60}>
              <div className="h-full rounded-2xl bg-white/6 p-7 ring-1 ring-white/12">
                <h3 className="flex items-center gap-2.5 font-semibold">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-leaf-500 text-deep">
                    <Check size={14} />
                  </span>
                  Required on every post
                </h3>
                <ul className="mt-5 space-y-3">
                  {creatorCompliance.required.map((rule) => (
                    <li key={rule} className="flex items-start gap-3 text-[0.95rem] leading-relaxed">
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-leaf-500"
                      />
                      <span className="text-white/85">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-2xl bg-white/6 p-7 ring-1 ring-white/12">
                <h3 className="flex items-center gap-2.5 font-semibold">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-white/20 text-white">
                    <Close size={13} />
                  </span>
                  Never allowed
                </h3>
                <ul className="mt-5 space-y-3">
                  {creatorCompliance.prohibited.map((rule) => (
                    <li key={rule} className="flex items-start gap-3 text-[0.95rem] leading-relaxed">
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-white/45"
                      />
                      <span className="text-white/85">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <p className="mt-8 max-w-3xl text-[0.95rem] leading-relaxed text-white/70">
              {creatorCompliance.approval}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- segments ---------------- */}
      {/* Accordion rather than seven stacked blocks: laid flat this is far and
          away the longest part of the page, and a creator only needs their own
          niche. Native <details> keeps it findable by in-page search and
          working without JavaScript. */}
      <section aria-labelledby="segments-heading" className="bg-white py-20 sm:py-24">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <SectionKicker>Segments</SectionKicker>
              <h2 id="segments-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
                Find your niche.
              </h2>
              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
                Angles, hooks and formats written for each audience. The compliance rules above
                apply to all of them.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-12 max-w-3xl divide-y divide-line border-y border-line">
            {creatorSegments.map((seg, i) => (
              <Reveal key={seg.id} delay={Math.min(i * 50, 200)}>
                <details id={seg.id} className="group faq-item scroll-mt-24">
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-6 py-5
                               text-left font-semibold text-ink transition-colors duration-200
                               hover:text-cyan-700 [&::-webkit-details-marker]:hidden"
                  >
                    <span className="text-[1.02rem] leading-snug">{seg.name}</span>
                    <span
                      aria-hidden="true"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full
                                 bg-mist text-cyan-700 ring-1 ring-line transition-transform
                                 duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45
                                 motion-reduce:transition-none"
                    >
                      <Plus size={17} />
                    </span>
                  </summary>

                  <div className="pb-8">
                    <p className="max-w-2xl leading-relaxed text-ink-2">{seg.summary}</p>

                    <div className="mt-7 grid gap-7 sm:grid-cols-2">
                      <div>
                        <h4 className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                          Hooks
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {seg.hooks.map((h) => (
                            <li
                              key={h}
                              className="border-l-2 border-cyan-500/40 pl-3.5 text-[0.95rem] leading-relaxed text-ink-2"
                            >
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                          Formats
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {seg.formats.map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-ink-2"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-ink-3/45"
                              />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-6 rounded-2xl bg-tint p-6 sm:grid-cols-2">
                      <div>
                        <h4 className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink-2">
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-leaf-500 text-deep">
                            <Check size={12} />
                          </span>
                          Do
                        </h4>
                        <ul className="mt-3 space-y-2 text-[0.93rem] leading-relaxed text-ink-2">
                          {seg.dos.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink-2">
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-ink-3/20 text-ink-2">
                            <Close size={11} />
                          </span>
                          Do not
                        </h4>
                        <ul className="mt-3 space-y-2 text-[0.93rem] leading-relaxed text-ink-2">
                          {seg.donts.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- submit ---------------- */}
      <section aria-labelledby="submit-heading" className="bg-tint py-20 sm:py-24">
        <div className="shell">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <SectionKicker>Submissions</SectionKicker>
              <h2 id="submit-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
                {creatorContact.title}
              </h2>
              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
                {creatorContact.lead}
              </p>

              <div className="mt-9 flex flex-col items-center gap-4">
                <ButtonLink href={mailto} variant="primary" size="lg" withArrow>
                  {partnersEmail}
                </ButtonLink>
                <p className="text-[0.9rem] text-ink-3">{creatorContact.socials}</p>
              </div>

              <div className="mt-10 flex justify-center">
                <StoreBadges height={52} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

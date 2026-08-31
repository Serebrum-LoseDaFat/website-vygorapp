import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/Button";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Check, Close, Plus, Sparkle, InstagramColor, TiktokColor } from "@/components/Icons";
import {
  creatorsIntro,
  creatorBenefits,
  creatorProduct,
  creatorPractices,
  creatorCompliance,
  creatorSegments,
  creatorContact,
} from "@/content/creators";
import { partnersEmail, siteUrl, links } from "@/lib/config";

/**
 * The creator program page.
 *
 * Its own route rather than a homepage section. The homepage is written for a
 * consumer deciding whether to download; this is written for a creator deciding
 * what they may say on camera. Two thousand words of compliance rules in the
 * middle of a conversion page would serve neither.
 *
 * Order is deliberate and is a compliance decision, not a design one: offer,
 * then product, then craft, then the rules, and only then the per-niche angles.
 * A creator who skims to their own segment has still scrolled past the
 * prohibited list on the way.
 *
 * DISCLOSURE PATTERN: the product and craft sections show a title and a single
 * line, and hold their paragraph behind a native <details>. Sixteen paragraphs
 * open at once was the single biggest reason the page read as a wall of text.
 * <details>/<summary> is used rather than a click handler on a div because the
 * accessibility guidance is explicit that a disclosure needs a real control
 * with real expanded state — this gets that, plus keyboard operation, in-page
 * find, and correct behaviour with JavaScript disabled, for free.
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
  openGraph: { title, description, url: `${siteUrl}/creators`, type: "article" },
};

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
      {children}
    </p>
  );
}

/**
 * A platform pill that drifts beside the hero artwork. Decoration, so it carries
 * a handle and nothing else — a follower count or an engagement figure here
 * would be invented, and the site does not publish numbers it cannot support.
 */
function PlatformChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2.5 rounded-full bg-white/95 py-2 pl-2 pr-4 text-[0.82rem] font-semibold text-ink shadow-[0_12px_34px_-12px_rgb(6_34_49/0.5)] ring-1 ring-line backdrop-blur-sm">
      {icon}
      {label}
    </span>
  );
}

/** The shared open/close affordance on every disclosure card. */
function Chevron() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-mist text-cyan-700
                 ring-1 ring-line transition-transform duration-300 ease-[var(--ease-out-soft)]
                 group-open:rotate-45 motion-reduce:transition-none"
    >
      <Plus size={15} />
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
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
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
                      see what their own audience will land on. */}
                  <ButtonLink href={siteUrl} variant="secondary" size="lg" external withArrow>
                    Visit vygor.app
                  </ButtonLink>
                </div>
              </div>
            </Reveal>

            {/* Phone with the contest screen — the one feature a creator can
                point their own audience at — and two platform chips drifting
                beside it.

                An illustration with the App Store listing laid over it was tried
                here and rejected: the product itself is the more persuasive
                image on a page asking someone to make content about it.

                Only the chips move. The screenshot never rotates, tilts or
                drifts: product UI stays upright and unaltered, and the chips are
                our own decoration rather than cropped app pixels floated back
                over the screen they came from. Motion guidance is to keep moving
                elements to one or two per view, so it is two, both slow and
                low-amplitude, and `float-slow` already disables itself under
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
                  <PlatformChip icon={<TiktokColor size={21} />} label="@vygorapp" />
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
                  <PlatformChip icon={<InstagramColor size={21} />} label="@vygorapp" />
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
              {[
                ...creatorBenefits.items,
                ...(creatorBenefits.commercial ? [creatorBenefits.commercial] : []),
              ].map((item) => (
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
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- the product ---------------- */}
      <section aria-labelledby="product-heading" className="bg-tint py-20 sm:py-24">
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

          {/* Each card previews the tool it names. The phone is a complete
              screen that bleeds off the bottom of its window — never a region
              cut out of a screenshot and floated back over it. */}
          <Reveal delay={80}>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {creatorProduct.tools.map((tool) => (
                <li
                  key={tool.name}
                  className="overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-shadow duration-200 hover:shadow-soft"
                >
                  <div className="relative h-52 overflow-hidden bg-[linear-gradient(160deg,var(--color-mist),var(--color-cyan-100))]">
                    {/* Image sits outside the summary so its description is not
                        read out as part of the button's name. `frameTop` slides
                        the screen so the window lands on the part that explains
                        the tool — the contest card, the macro rings, the bar
                        chart — rather than always on the app header. */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ top: "frameTop" in tool ? tool.frameTop : 28 }}
                    >
                      <PhoneFrame id={tool.screen} width={148} proportional />
                    </div>
                  </div>

                  <details className="group faq-item">
                    <summary
                      className="flex cursor-pointer list-none items-start justify-between gap-4 p-5
                                 text-left transition-colors duration-200 hover:text-cyan-700
                                 [&::-webkit-details-marker]:hidden"
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink">{tool.name}</span>
                        <span className="mt-1 block text-[0.9rem] leading-snug text-ink-2">
                          {tool.tagline}
                        </span>
                      </span>
                      <Chevron />
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-[0.92rem] leading-relaxed text-ink-2">{tool.body}</p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- best practice ---------------- */}
      <section aria-labelledby="craft-heading" className="bg-white py-20 sm:py-24">
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <SectionKicker>Best practice</SectionKicker>
              <h2 id="craft-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
                What makes a short-form video work.
              </h2>
              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
                Eight rules that hold whatever your niche is. Open any one for the reasoning.
              </p>
            </div>
          </Reveal>

          {/* Numbered rows rather than eight paragraph cards. Closed, the whole
              section is scannable in a few seconds. */}
          <Reveal delay={80}>
            <div className="mt-12 grid gap-x-10 sm:grid-cols-2">
              {creatorPractices.map((item, i) => (
                <details key={item.title} className="group faq-item border-t border-line">
                  <summary
                    className="flex cursor-pointer list-none items-center justify-between gap-4 py-5
                               text-left transition-colors duration-200 hover:text-cyan-700
                               [&::-webkit-details-marker]:hidden"
                  >
                    <span className="flex min-w-0 items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-[0.8rem] font-semibold tabular-nums text-cyan-700/70"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-ink">{item.title}</span>
                    </span>
                    <Chevron />
                  </summary>
                  <div className="pb-5 pl-10 pr-10">
                    <p className="text-[0.92rem] leading-relaxed text-ink-2">{item.body}</p>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- compliance ---------------- */}
      {/* On the deep bed so it reads as the serious part of the page rather than
          one more card grid. This is the section with legal consequences, and it
          is the one section that does NOT hide its content behind a click. */}
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

      {/* ---------------- contact ---------------- */}
      {/* Contact first, submission checklist beside it. The old version led with
          "Send a draft", which only speaks to creators already accepted and left
          everyone else with no way to make contact. */}
      <section aria-labelledby="contact-heading" className="bg-tint py-20 sm:py-24">
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <SectionKicker>{creatorContact.kicker}</SectionKicker>
              <h2 id="contact-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
                {creatorContact.title}
              </h2>
              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
                {creatorContact.lead}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Reveal delay={60}>
              <div className="h-full rounded-2xl bg-white p-7 ring-1 ring-line sm:p-8">
                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                  Email
                </p>
                <a
                  href={mailto}
                  className="mt-2 block break-words text-[1.35rem] font-semibold text-cyan-700 underline decoration-cyan-700/30 underline-offset-[6px] transition-colors hover:decoration-cyan-700 sm:text-[1.5rem]"
                >
                  {partnersEmail}
                </a>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-2">
                  {creatorContact.turnaround}
                </p>

                <p className="mt-8 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                  Follow
                </p>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {links.instagram ? (
                    <li>
                      <a
                        href={links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-full bg-tint py-2 pl-2 pr-4 text-[0.88rem] font-semibold text-ink ring-1 ring-line transition-colors hover:bg-mist"
                      >
                        <InstagramColor size={20} />
                        @vygorapp
                      </a>
                    </li>
                  ) : null}
                  {links.tiktok ? (
                    <li>
                      <a
                        href={links.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 rounded-full bg-tint py-2 pl-2 pr-4 text-[0.88rem] font-semibold text-ink ring-1 ring-line transition-colors hover:bg-mist"
                      >
                        <TiktokColor size={20} />
                        @vygorapp
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-2xl bg-white p-7 ring-1 ring-line sm:p-8">
                <h3 className="font-semibold text-ink">{creatorContact.submissionTitle}</h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">
                  {creatorContact.submissionLead}
                </p>
                <ul className="mt-5 space-y-3">
                  {creatorContact.submission.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-leaf-500 text-deep">
                        <Check size={12} />
                      </span>
                      <span className="text-[0.95rem] leading-relaxed text-ink-2">{item}</span>
                    </li>
                  ))}
                </ul>

                <ButtonLink href={mailto} variant="primary" size="md" className="mt-7" withArrow>
                  Send a draft
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

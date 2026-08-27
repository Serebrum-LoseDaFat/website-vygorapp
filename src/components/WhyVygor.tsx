import { Reveal } from "./Reveal";
import { Activity, Heart, Sparkle, Clock } from "./Icons";
import { whyVygor } from "@/content/site";

/**
 * The "why download this" section.
 *
 * Sits after the five modules on purpose: once someone knows what Vygor does,
 * this answers what they get out of it. Every card is an outcome rather than a
 * feature restated, so it does not read as a second feature list.
 */

const icons = { clock: Clock, sparkle: Sparkle, heart: Heart, activity: Activity } as const;

export function WhyVygor() {
  return (
    <section aria-labelledby="why-heading" className="border-y border-line bg-tint py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="why-heading" className="text-[length:var(--text-h2)] text-ink">
              {whyVygor.title}
            </h2>
            <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {whyVygor.lead}
            </p>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyVygor.reasons.map((reason, i) => {
            const Icon = icons[reason.icon];
            return (
              <Reveal as="li" key={reason.title} delay={i * 70}>
                <div className="flex h-full flex-col rounded-[var(--radius-card)] bg-white p-7 shadow-soft ring-1 ring-line transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lift">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
                    <Icon size={23} />
                  </span>
                  <h3 className="mt-5 text-[1.15rem] font-bold tracking-tight text-ink">
                    {reason.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-ink-2">
                    {reason.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

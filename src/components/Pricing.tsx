import { Reveal } from "./Reveal";
import { StoreBadges } from "./StoreBadges";
import { Check } from "./Icons";
import { pricing } from "@/content/site";

/**
 * Pricing, framed as a comparison rather than a table of tiers.
 *
 * Vygor has one subscription, so a conventional three-column pricing grid has
 * nothing to compare. What a visitor is actually weighing is Vygor against the
 * apps they would otherwise buy, so that is what this section shows: the real
 * annual list price of a well-known app for each job Vygor does, totalled, next
 * to the single Vygor price.
 *
 * Naming real competitors and prices means the claim is checkable, so the
 * caveat underneath is not optional — prices move with promotions and region,
 * and the section says so in plain language rather than in a footnote nobody
 * reads.
 */

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export function Pricing() {
  const total = pricing.rows.reduce((sum, row) => sum + row.annual, 0);
  const vygor = 79.99;
  const saving = total - vygor;

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="scroll-mt-24 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              {pricing.kicker}
            </p>
            <h2 id="pricing-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
              {pricing.title}
            </h2>
            <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {pricing.lead}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          {/* -------- what it costs separately -------- */}
          <Reveal>
            <div className="rounded-[var(--radius-card)] bg-tint p-6 ring-1 ring-line sm:p-8">
              <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink-3">
                Buying it separately
              </h3>

              <ul className="mt-6 flex flex-col">
                {pricing.rows.map((row) => (
                  <li
                    key={row.job}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line py-3.5 last:border-0"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{row.job}</span>
                      <span className="block text-[0.9rem] text-ink-3">{row.app}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-semibold tabular-nums text-ink">
                        {money(row.annual)}
                      </span>
                      <span className="block text-[0.82rem] text-ink-3">/ year</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t-2 border-ink/10 pt-5">
                <span className="font-bold text-ink">Total</span>
                <span className="text-[1.45rem] font-bold tabular-nums text-ink">
                  {money(total)}
                  <span className="ml-1 text-[0.9rem] font-medium text-ink-3">/ year</span>
                </span>
              </div>
            </div>
          </Reveal>

          {/* -------- the one Vygor plan -------- */}
          <Reveal delay={90}>
            <div className="cta-gradient grain relative overflow-hidden rounded-[var(--radius-card)] p-6 text-white sm:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-24 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(closest-side,rgb(79_227_224/0.26),transparent)]" />
              </div>

              <div className="relative">
                <h3 className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-aqua-300">
                  With Vygor
                </h3>

                <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[3rem] font-bold leading-none tracking-tight tabular-nums">
                    {pricing.plan.price}
                  </span>
                  <span className="text-[1.05rem] text-white/75">{pricing.plan.period}</span>
                </p>
                <p className="mt-3 font-semibold">{pricing.plan.name}</p>
                <p className="mt-1.5 leading-relaxed text-white/75">{pricing.plan.blurb}</p>

                <p className="mt-6 inline-flex rounded-full bg-leaf-500 px-4 py-2 text-[0.95rem] font-bold text-deep">
                  Saves {money(saving)} a year
                </p>

                <ul className="mt-7 grid gap-2.5 border-t border-white/12 pt-6 sm:grid-cols-2">
                  {pricing.plan.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.95rem]">
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-aqua-300">
                        <Check size={12} />
                      </span>
                      <span className="text-white/85">{item}</span>
                    </li>
                  ))}
                </ul>

                <StoreBadges className="mt-8" height={52} />
                <p className="mt-4 text-sm text-white/70">Free to download.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={60}>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[0.85rem] leading-relaxed text-ink-3">
            {pricing.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

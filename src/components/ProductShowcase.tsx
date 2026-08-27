import { PhoneFrame } from "./PhoneFrame";
import { Reveal } from "./Reveal";
import { showcase } from "@/content/site";

/**
 * "Your whole wellness journey, in one view."
 *
 * Every screen is shown at once, in the order you would meet it during a day.
 * This replaced a tab switcher, which had three problems: the headline promised
 * one view but showed one screen at a time, the caption sat marooned beside a
 * very tall phone, and the interaction duplicated the five-module section
 * directly above it. A row of screens says the same thing without asking the
 * visitor to click anything to understand it.
 *
 * No JavaScript: it is a plain list that becomes a scroll-snapped filmstrip
 * below the desktop breakpoint. A soft connecting line runs behind the phones
 * to read the row as one continuous journey rather than four loose cards.
 */

export function ProductShowcase() {
  return (
    <section aria-labelledby="showcase-heading" className="overflow-hidden bg-tint py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              A day with Vygor
            </p>
            <h2 id="showcase-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
              Your whole wellness journey, in one view.
            </h2>
          </div>
        </Reveal>
      </div>

      {/* Full-bleed on small screens so the filmstrip can run past the gutter. */}
      <Reveal delay={90} y={22}>
        <div className="relative mt-14">
          {/* Connecting line, desktop only, behind the row. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[7.5rem] hidden h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent lg:block"
          />

          <ol
            className="
              relative flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4
              [scrollbar-width:none] sm:px-8 lg:justify-center lg:overflow-visible lg:px-10
              [&::-webkit-scrollbar]:hidden
            "
          >
            {showcase.map((item, i) => (
              <li
                key={item.id}
                className="flex w-[248px] shrink-0 snap-center flex-col items-center text-center lg:w-auto lg:max-w-[15rem]"
              >
                {/* Step marker sits on the connecting line. */}
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3.5 py-1.5 text-[0.78rem] font-semibold text-cyan-700 shadow-soft">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-[1.15rem] items-center justify-center rounded-full bg-cyan-600 text-[0.75rem] font-bold leading-none text-white"
                  >
                    {i + 1}
                  </span>
                  {item.step}
                </span>

                <PhoneFrame id={item.screen} width={222} />

                <h3 className="mt-7 text-[1.15rem] font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Scroll affordance, only where the row actually scrolls. */}
      <p className="shell mt-2 text-center text-sm text-ink-3 lg:hidden">Swipe to see more →</p>
    </section>
  );
}

import { Reveal } from "./Reveal";
import { Plus } from "./Icons";
import { ButtonLink } from "./Button";
import { faqs } from "@/content/site";

/**
 * FAQ accordion.
 *
 * Built on native <details>/<summary> rather than a JavaScript widget. That
 * buys correct semantics for free — it is focusable, toggles on Enter and
 * Space, exposes its expanded state to assistive tech, is findable by the
 * browser's in-page search, and keeps working if JS fails to load.
 *
 * Multiple panels may be open at once (no `name` attribute): in a support
 * context people routinely compare two answers, and auto-closing the previous
 * one is a small hostility.
 *
 * The open/close height transition uses `interpolate-size` and
 * `::details-content`, which degrades to an instant, still-correct toggle in
 * browsers that do not support them yet.
 */

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 bg-tint py-20 sm:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              FAQ
            </p>
            <h2 id="faq-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
              Questions, answered.
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-ink-2">
              Still not sure about something? We read everything that comes in.
            </p>
            {/* One contact form on the page, in its own section. */}
            <ButtonLink href="/#contact" variant="secondary" size="md" className="mt-6" withArrow>
              Ask us a question
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group faq-item">
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-6 py-5
                             text-left font-semibold text-ink transition-colors duration-200
                             hover:text-cyan-700 [&::-webkit-details-marker]:hidden"
                >
                  <span className="text-[1.02rem] leading-snug">{faq.q}</span>
                  <span
                    aria-hidden="true"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full
                               bg-white text-cyan-700 ring-1 ring-line transition-transform
                               duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45
                               motion-reduce:transition-none"
                  >
                    <Plus size={17} />
                  </span>
                </summary>

                <div className="pb-6 pr-12">
                  <p className="leading-relaxed text-ink-2">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Reveal } from "./Reveal";
import { Plus } from "./Icons";
import { faqGroups, faqIntro } from "@/content/site";
import { supportEmail } from "@/lib/config";

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
 *
 * LAYOUT: a centred header over a single measured column, matching the pricing
 * section. The previous two-column split put a short sticky heading beside a
 * long list, which left a tall empty gutter on the left and made eleven
 * ungrouped questions read as an undifferentiated wall. The questions are now
 * split into three labelled groups so the eye can land on the relevant part.
 */

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 bg-tint py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              {faqIntro.kicker}
            </p>
            <h2 id="faq-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
              {faqIntro.title}
            </h2>
            <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {faqIntro.lead}
            </p>
            {/* A sentence, not a second call to action — the support section
                below owns that. It is here because the question someone cannot
                find an answer to is the one they need most. */}
            <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-3">
              Not covered here?{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="font-semibold text-cyan-700 underline decoration-cyan-700/35 underline-offset-4 transition-colors hover:decoration-cyan-700"
              >
                {supportEmail}
              </a>{" "}
              reaches a person, not a bot.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl">
          {faqGroups.map((group, gi) => (
            <Reveal key={group.id} delay={gi * 80}>
              <div className={gi === 0 ? "" : "mt-12"}>
                <h3 className="text-[0.95rem] font-semibold uppercase tracking-[0.1em] text-ink-2">
                  {group.title}
                </h3>

                <div className="mt-4 divide-y divide-line border-y border-line">
                  {group.items.map((faq) => (
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
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

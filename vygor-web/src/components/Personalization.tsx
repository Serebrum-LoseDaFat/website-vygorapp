import { Reveal } from "./Reveal";
import { PhoneFrame } from "./PhoneFrame";
import { personalization } from "@/content/site";

/**
 * The differentiation section.
 *
 * Reached from the "Why AI" nav link, so it has to actually answer that
 * question rather than just assert personalization: AI is what lets the plan be
 * rewritten every week from six changing inputs, which a human plan written
 * once cannot do.
 *
 * Shown as a set of input "facets" feeding one plan, rather than explained in
 * a paragraph. Deliberately restrained: no medical or clinical claims, and no
 * suggestion of a diagnostic capability — these are preferences and inputs the
 * app genuinely collects.
 */

export function Personalization() {
  return (
    <section id="why-ai" aria-labelledby="personalization-heading" className="scroll-mt-24 py-20 sm:py-28">
      <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20">
        <Reveal>
          <div className="relative flex justify-center lg:justify-start">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 m-auto h-[68%] w-[82%] rounded-[50%] bg-leaf-300 opacity-45 blur-3xl"
            />
            <PhoneFrame id="coach" width={300} />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-leaf-800">
              {personalization.kicker}
            </p>
            <h2 id="personalization-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
              {personalization.title}
            </h2>
            <p className="mt-5 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {personalization.lead}
            </p>
          </Reveal>

          <dl className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {personalization.facets.map((facet, i) => (
              <Reveal key={facet.label} delay={i * 60}>
                {/* A left rule instead of a card keeps this from becoming
                    another grid of boxes. */}
                <div className="border-l-2 border-cyan-200 pl-4 transition-colors duration-300 hover:border-cyan-500">
                  <dt className="font-semibold text-ink">{facet.label}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{facet.detail}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

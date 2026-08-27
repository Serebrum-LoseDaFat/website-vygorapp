import { Reveal } from "./Reveal";
import { PhoneFrame } from "./PhoneFrame";
import { howItWorks } from "@/content/site";

/**
 * Three steps, told with large numerals and very little copy.
 *
 * Sits on the deep navy bed — it is the page's tonal breather between two
 * light sections, and gives the brand's cyan/aqua accents somewhere to glow.
 * Every foreground colour used here clears AAA on --color-deep.
 */

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="grain relative scroll-mt-24 overflow-hidden bg-deep py-20 text-white sm:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_156_228/0.30),transparent)]" />
        <div className="absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(79_227_224/0.20),transparent)]" />
      </div>

      <div className="shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-aqua-300">
              How it works
            </p>
            <h2 id="how-heading" className="mt-3 text-[length:var(--text-h2)]">
              Three steps. Then it just runs.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <ol className="flex flex-col">
            {howItWorks.map((item, i) => (
              <Reveal as="li" key={item.step} delay={i * 90}>
                <div className="flex gap-6 border-t border-white/12 py-8 sm:gap-9 sm:py-10">
                  <span
                    aria-hidden="true"
                    className="shrink-0 bg-gradient-to-b from-white to-white/35 bg-clip-text text-[2.6rem] font-bold leading-none tracking-tight text-transparent tabular-nums sm:text-[3.4rem]"
                  >
                    {item.step}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-[length:var(--text-h3)] font-semibold">
                      {/* The numeral is decorative, so it is restated for AT here. */}
                      <span className="sr-only">Step {Number(item.step)}: </span>
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-md leading-relaxed text-white/72">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={140} y={24}>
            <div className="relative flex justify-center lg:justify-end">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 m-auto h-[70%] w-[92%] rounded-[50%] bg-cyan-500/25 blur-3xl"
              />
              {/* Four screens rather than one. The single analytics phone that
                  used to sit here is also the subject of a card in the features
                  section, so the page showed the same screen twice and this
                  section read as a repeat. These four are the ones a new user
                  actually moves through: set a goal, watch progress, log a
                  meal, see the day.

                  `proportional` matters at this size — the bezel and dynamic
                  island are authored for a 300px frame and would otherwise stay
                  at full size on a 200px phone. The second column is nudged
                  down so the four read as a group rather than a rigid grid. */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <PhoneFrame id="goals" width={200} proportional />
                  <PhoneFrame id="tracker" width={200} proportional />
                </div>
                <div className="flex translate-y-6 flex-col gap-4">
                  <PhoneFrame id="progress" width={200} proportional />
                  <PhoneFrame id="meal-calendar" width={200} proportional />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

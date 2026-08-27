import Image from "next/image";
import { Reveal } from "./Reveal";
import { emotional } from "@/content/site";
import { leafMark } from "@/content/screens";

/**
 * The quiet moment in the page.
 *
 * No product, no chrome, no CTA — a single large statement on a pale mint
 * field. Its job is pacing: it lets the reader come up for air between the
 * dense personalization grid and the testimonial/FAQ run, and it is the one
 * place the site speaks to how the reader feels rather than what the app does.
 */

export function EmotionalBenefit() {
  return (
    <section
      aria-labelledby="emotional-heading"
      className="relative overflow-hidden bg-mist py-24 sm:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[68rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.9),transparent)]" />
      </div>

      <div className="shell">
        <Reveal>
          <figure className="mx-auto max-w-3xl text-center">
            {/* The Vygor leaf mark, used once, at scale, as punctuation. */}
            <Image
              src={leafMark.src}
              alt=""
              width={leafMark.width}
              height={leafMark.height}
              sizes="72px"
              className="mx-auto h-16 w-auto"
            />

            <blockquote>
              <h2
                id="emotional-heading"
                className="mt-8 text-[length:var(--text-h1)] leading-[1.08] text-ink"
              >
                {emotional.title}
              </h2>
            </blockquote>

            <figcaption className="mx-auto mt-7 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {emotional.body}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

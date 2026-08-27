import { HeroPhones } from "./HeroPhones";
import { StoreBadges } from "./StoreBadges";
import { Reveal } from "./Reveal";
import { Sparkle } from "./Icons";
import { hero } from "@/content/site";

/**
 * Hero.
 *
 * The product visual is two complete phones (see HeroPhones) rather than one
 * phone with UI cards floated over it. Everything else here — eyebrow,
 * headline, lead, badge, reassurance line — is unchanged.
 */

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[22rem] left-1/2 h-[46rem] w-[80rem] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,var(--color-cyan-100),transparent)] opacity-90" />
      <div className="absolute -right-40 top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--color-aqua-200),transparent)] opacity-55" />
      <div className="absolute -left-52 top-[26rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,var(--color-leaf-100),transparent)] opacity-75" />

      <svg
        className="absolute inset-x-0 bottom-0 h-56 w-full text-tint"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path d="M0 96c220 62 420 78 720 42S1230 62 1440 96v104H0Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export function Hero() {
  const lead = hero.title.slice(0, hero.title.lastIndexOf(hero.accent));

  return (
    <section className="relative overflow-hidden pb-16 pt-30 sm:pb-20 sm:pt-34 lg:pb-28 lg:pt-40">
      <HeroBackdrop />

      <div className="shell grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-10">
        {/* ---------------- copy ---------------- */}
        <div className="max-w-2xl lg:max-w-none">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/70 px-4 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-cyan-700 backdrop-blur">
              <Sparkle size={15} />
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="mt-6 text-[length:var(--text-display)] text-ink">
              {lead}
              <span className="brand-text-gradient">{hero.accent}</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {hero.lead}
            </p>
          </Reveal>

          {/* The badge is the only call to action, so it is given real size. */}
          <Reveal delay={210}>
            <StoreBadges className="mt-9" height={66} />
          </Reveal>
        </div>

        {/* ---------------- product ---------------- */}
        {/* The caption is centred in the plain column, which is where the
            pair's centre lands: the pair extends half its overhang to the left
            of the primary, and the primary is itself centred in the column
            minus that overhang. Adding the padding here would centre on the
            primary instead and sit the line ~100px too far right. */}
        <div>
          <Reveal delay={160} y={26}>
            <HeroPhones />
          </Reveal>

          <Reveal delay={280}>
            <div>
              <p className="mx-auto max-w-[20rem] text-center text-[1.15rem] font-bold leading-snug text-ink sm:text-[1.3rem]">
                {hero.caption}
              </p>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

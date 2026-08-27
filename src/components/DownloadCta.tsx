import { Reveal } from "./Reveal";
import { PhoneFrame } from "./PhoneFrame";
import { StoreBadges } from "./StoreBadges";
import { Check } from "./Icons";
import { downloadCta } from "@/content/site";
import { hasAnyStoreLink } from "@/lib/config";

/**
 * The single closing conversion panel.
 *
 * Two earlier problems fixed here. The dark panel had large empty areas above
 * and below the pitch, so it now carries a compact recap of the five AI
 * systems — the last thing a visitor reads before deciding is what they
 * actually get. And the two phones floated apart with a gap between them,
 * reading as two unrelated pictures; they are now a tight overlapping fan that
 * reads as one product.
 *
 * A QR code was considered and left out: generating one would mean either a
 * runtime dependency or a hand-rolled encoder, and on the desktop viewport
 * where a QR actually helps, the store badge is one click away.
 */

export function DownloadCta() {
  return (
    <section
      aria-labelledby="download-heading"
      className="relative overflow-hidden bg-white py-20 sm:py-28"
    >
      <div className="shell">
        <div className="grain relative overflow-hidden rounded-[2.25rem] bg-deep px-7 py-14 text-white sm:px-12 sm:py-16 lg:px-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_156_228/0.38),transparent)]" />
            <div className="absolute -bottom-32 right-1/3 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(132_192_84/0.22),transparent)]" />
          </div>

          <div className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
            {/* -------- pitch + recap -------- */}
            <div>
              <Reveal>
                <div className="max-w-xl">
                  <h2 id="download-heading" className="text-[length:var(--text-h2)]">
                    {downloadCta.title}
                  </h2>
                  <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-white/75">
                    {downloadCta.body}
                  </p>

                  {hasAnyStoreLink ? (
                    <>
                      <StoreBadges className="mt-8" />
                      <p className="mt-4 text-sm text-white/70">{downloadCta.footnote}</p>
                    </>
                  ) : null}
                </div>
              </Reveal>

              {/* What comes in the box. Fills the panel and answers the last
                  question a visitor has before tapping download. */}
              <Reveal delay={90}>
                <ul className="mt-10 grid gap-2.5 border-t border-white/12 pt-8 sm:grid-cols-2">
                  {downloadCta.included.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-start gap-3 rounded-2xl bg-white/6 px-4 py-3 ring-1 ring-white/10"
                    >
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-leaf-500 text-deep">
                        <Check size={12} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.95rem] font-semibold leading-snug">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block text-[0.85rem] leading-snug text-white/70">
                          {item.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* -------- phones -------- */}
            {/* A tight overlapping fan. Offsets are tuned so each screen sits
                just inside the one behind it, which is what makes the group
                read as a single object rather than three loose pictures. */}
            <Reveal delay={140} y={24}>
              <div className="flex justify-center lg:justify-end">
                {/* Each frame is wrapped in its own positioned div rather than
                    given `absolute` directly. PhoneFrame's own classes start
                    with `relative`, and Tailwind emits `relative` after
                    `absolute` in the cascade, so passing `absolute` down would
                    lose and the phones would stack vertically instead. */}
                {/* The fan is laid out ONCE, at its full desktop size, and
                    scaled down as a whole on small screens.

                    Two reasons. The phones were 150px wide while the bezel and
                    dynamic island are authored for a 300px frame, so the island
                    covered 55% of each phone's width instead of 27% and the
                    group read as three toys — hence `proportional`, which ties
                    that geometry to the width. And a rotated, overlapping fan
                    cannot be re-laid-out per breakpoint without re-tuning every
                    offset, so one transform on the wrapper keeps the
                    composition identical at every size while staying inside the
                    panel's overflow:hidden on narrow screens. The outer box
                    reserves the scaled height, so nothing collapses. */}
                <div className="relative h-[20rem] w-[16rem] sm:h-[34rem] sm:w-[27.5rem]">
                  <div className="absolute left-0 top-0 origin-top-left scale-[0.58] sm:scale-100">
                    <div className="relative h-[34rem] w-[27.5rem]">
                      <div className="absolute left-0 top-0 rotate-[-9deg]">
                        <PhoneFrame id="recipe-videos" width={198} proportional decorative />
                      </div>
                      <div className="absolute left-[6.9rem] top-[2.9rem] z-10 rotate-[-2deg]">
                        <PhoneFrame id="home" width={208} proportional decorative />
                      </div>
                      <div className="absolute left-[13.7rem] top-[5.8rem] z-20 rotate-[6deg]">
                        <PhoneFrame id="coach" width={198} proportional />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

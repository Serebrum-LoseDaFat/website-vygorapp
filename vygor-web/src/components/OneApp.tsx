import { PhoneFrame } from "./PhoneFrame";
import { Reveal } from "./Reveal";
import { oneApp } from "@/content/site";

/**
 * "Less juggling. More progress."
 *
 * The convergence idea is carried by layout rather than by animation: eight
 * scattered capability chips orbit a single phone with dashed connectors
 * running behind them. The whole composition fades up once as a unit via the
 * parent Reveal, so nothing animates while it is off-screen.
 *
 * Chips are absolutely positioned on desktop where there is room to arrange
 * them around the device, and fall back to a plain centred wrap on mobile.
 *
 * The device is upright and untransformed: product screenshots are never
 * rotated, mirrored or put into perspective anywhere on this site.
 */

// Percent coordinates around the device, tuned to avoid the phone's footprint.
const ORBIT = [
  { top: "6%", left: "2%" },
  { top: "1%", right: "6%" },
  { top: "28%", left: "-4%" },
  { top: "24%", right: "-2%" },
  { bottom: "27%", left: "-2%" },
  { bottom: "31%", right: "-4%" },
  { bottom: "4%", left: "6%" },
  { bottom: "1%", right: "8%" },
] as const;

export function OneApp() {
  return (
    <section aria-labelledby="oneapp-heading" className="relative overflow-hidden bg-tint py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--color-cyan-100),transparent)] opacity-70"
      />

      <div className="shell relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="oneapp-heading" className="text-[length:var(--text-h2)] text-ink">
              {oneApp.title}
            </h2>
            <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {oneApp.lead}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100} y={24}>
          <div className="relative mx-auto mt-16 flex max-w-4xl justify-center">
            {/* Connector lines, desktop only. Drawn behind the chips and phone. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 800 560"
              className="absolute inset-0 hidden h-full w-full lg:block"
              fill="none"
            >
              <g
                stroke="var(--color-cyan-300)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="4 7"
                opacity="0.75"
              >
                <path d="M150 70 Q300 150 380 250" />
                <path d="M650 55 Q520 150 425 245" />
                <path d="M85 200 Q240 240 370 280" />
                <path d="M715 190 Q570 240 435 275" />
                <path d="M90 380 Q240 350 372 315" />
                <path d="M710 365 Q560 340 432 312" />
                <path d="M170 500 Q300 420 382 350" />
                <path d="M640 512 Q510 430 424 352" />
              </g>
            </svg>

            {/* Chips — absolute on lg, plain wrap below it. */}
            <ul className="contents">
              {oneApp.nodes.map((node, i) => (
                <li
                  key={node}
                  className="absolute z-20 hidden lg:block"
                  style={ORBIT[i]}
                >
                  <span className="inline-block rounded-full border border-line bg-white/95 px-4 py-2 text-sm font-semibold text-ink shadow-soft backdrop-blur">
                    {node}
                  </span>
                </li>
              ))}
            </ul>

            {/* Upright and untransformed. This carried a rotateY/rotateX tilt,
                which is a perspective distortion of a real product screenshot —
                the same class of problem as the floating overlays it sat next
                to, and it made the UI harder to read for no gain. */}
            <div className="relative z-10">
              <PhoneFrame id="home" width={300} decorative />
            </div>
          </div>
        </Reveal>

        {/* Mobile / tablet fallback for the same eight capabilities. */}
        <Reveal delay={80}>
          <ul className="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-2.5 lg:hidden">
            {oneApp.nodes.map((node) => (
              <li
                key={node}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft"
              >
                {node}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

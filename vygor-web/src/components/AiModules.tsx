"use client";

import { useId, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import Image from "next/image";
import { Check } from "./Icons";
import { modules } from "@/content/site";
import { composite } from "@/content/screens";

/**
 * The six tools inside Vygor.
 *
 * Layout: the device stays on the left and a stack of selectable panels sits on
 * the right. Choosing a panel expands its detail and swaps the device image —
 * the panels are the navigation, so the picture and the words always agree.
 *
 * It is a real ARIA tabs widget with a vertical orientation: roving tabindex,
 * up/down (and left/right) arrow keys, Home and End. Every mockup is rendered
 * and cross-faded in one grid cell so switching never flashes an empty frame
 * and never changes the section's height.
 *
 * Each panel shows a hand-composed product shot: a complete phone with its
 * pop-out card already laid out in the artwork. They are rendered bare — the
 * artwork carries its own device frame, so wrapping it in PhoneFrame would
 * double the bezel — and with no transform of any kind, so the UI can never end
 * up mirrored, rotated or stretched.
 *
 * This replaced DOM overlays positioned over a screenshot. Those could never be
 * better than approximately aligned; here the composition is settled in the
 * source artwork, so there is nothing left to align. The pipeline crops all six
 * to one window registered on the phone bezel, so the device does not shift
 * when the selected panel changes.
 *
 * The artwork sits on a pure-white ground, which is why the phone column has no
 * glow behind it: a white rectangle over a cyan blur would read as a bug.
 *
 * On mobile the device sits above the stack, because a phone shown beside
 * narrow text reads as decoration rather than as the subject.
 *
 * Selection is click/keyboard only, deliberately not hover: with six stacked
 * panels, simply moving the pointer down the page would strobe through every
 * screen on the way past.
 */

const accents = {
  cyan: { dot: "bg-cyan-500", ring: "ring-cyan-200", text: "text-cyan-700" },
  leaf: { dot: "bg-leaf-500", ring: "ring-leaf-300/60", text: "text-leaf-800" },
  aqua: { dot: "bg-aqua-500", ring: "ring-aqua-200", text: "text-cyan-800" },
  sage: { dot: "bg-sage", ring: "ring-line-strong", text: "text-slate-brand" },
} as const;

export function AiModules() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabId = (i: number) => `${baseId}-tab-${modules[i].id}`;
  const panelId = `${baseId}-panel`;

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = modules.length - 1;
    let next: number | null = null;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = active === last ? 0 : active + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = active === 0 ? last : active - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      id="features"
      aria-labelledby="modules-heading"
      className="scroll-mt-24 overflow-hidden py-20 sm:py-28"
    >
      <div className="shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              What&rsquo;s inside
            </p>
            <h2 id="modules-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
              Your dietitian, trainer and coach — without the appointments.
            </h2>
            <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              Six tools that cover what to eat, how to move and whether it is working. They all
              read from the same picture of you, so none of them contradicts the others.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          {/* -------- device -------- */}
          <Reveal y={22} className="lg:sticky lg:top-28">
            <div className="relative flex justify-center">
              {/* One grid cell, every shot stacked and cross-faded. */}
              <div
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId(active)}
                className="grid w-[20rem] max-w-full sm:w-[21.5rem] lg:w-[22.5rem]"
              >
                {modules.map((mod, i) => {
                  const selected = i === active;
                  return (
                    <div
                      key={mod.id}
                      className="col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)]"
                      style={{
                        opacity: selected ? 1 : 0,
                        transform: selected ? "none" : "scale(0.97)",
                        pointerEvents: selected ? undefined : "none",
                      }}
                      aria-hidden={!selected}
                    >
                      {(() => {
                        const art = composite(mod.composite);
                        return (
                          <Image
                            src={art.src}
                            alt={selected ? art.alt : ""}
                            width={art.width}
                            height={art.height}
                            sizes="(max-width: 640px) 320px, (max-width: 1024px) 344px, 360px"
                            priority={i === 0}
                            loading={i === 0 ? undefined : "lazy"}
                            className="block h-auto w-full"
                          />
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* -------- selectable panels -------- */}
          <Reveal delay={90}>
            <div
              role="tablist"
              aria-label="Vygor AI systems"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="flex flex-col gap-3"
            >
              {modules.map((mod, i) => {
                const selected = i === active;
                const accent = accents[mod.tone];

                return (
                  <button
                    key={mod.id}
                    ref={(node) => {
                      tabRefs.current[i] = node;
                    }}
                    id={tabId(i)}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={[
                      "group cursor-pointer rounded-[1.25rem] border p-5 text-left sm:p-6",
                      "transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)]",
                      selected
                        ? `border-transparent bg-white shadow-lift ring-1 ${accent.ring}`
                        : "border-line bg-white/50 hover:border-line-strong hover:bg-white",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        aria-hidden="true"
                        className={[
                          "mt-1.5 size-2.5 shrink-0 rounded-full transition-transform duration-300",
                          accent.dot,
                          selected ? "scale-125" : "scale-90 opacity-45",
                        ].join(" ")}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[0.78rem] font-semibold uppercase tracking-[0.14em] ${
                            selected ? accent.text : "text-ink-3"
                          }`}
                        >
                          {mod.name}
                        </p>
                        <h3 className="mt-1.5 text-[length:var(--text-h3)] font-bold tracking-tight text-ink">
                          {mod.headline}
                        </h3>

                        {/* Detail is present for every panel so the section
                            height never jumps; only the selected one is open. */}
                        <div
                          className="grid transition-[grid-template-rows,opacity] duration-400 ease-[var(--ease-out-soft)]"
                          style={{
                            gridTemplateRows: selected ? "1fr" : "0fr",
                            opacity: selected ? 1 : 0,
                          }}
                        >
                          <div className="overflow-hidden">
                            <p className="pt-3 leading-relaxed text-ink-2">{mod.body}</p>
                            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                              {mod.points.map((point) => (
                                <li
                                  key={point}
                                  className="flex items-center gap-2 text-[0.9rem] font-medium text-ink-2"
                                >
                                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-800">
                                    <Check size={12} />
                                  </span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

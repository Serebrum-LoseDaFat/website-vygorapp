"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Close, InstagramColor, TiktokColor } from "./Icons";
import { links, partnersEmail } from "@/lib/config";

/**
 * In-page section navigation for /creators. This page only.
 *
 * It is by far the longest page on the site — offer, product, craft,
 * compliance, seven segment playbooks and contact — and a creator arriving from
 * a DM usually wants one of those rather than a scroll through all of them.
 *
 * TWO LAYOUTS, ONE COMPONENT
 *
 * Above `md` the six sections are pills, all visible at once. That is the
 * stronger pattern where they fit: nothing is hidden behind a click, and the
 * current section is highlighted while you read rather than only while a menu
 * is open.
 *
 * Below `md` they do not fit. Measured at 390px the row was 630px wide inside a
 * 358px viewport, so Segments and Contact sat off-screen with nothing to
 * indicate they existed. There the same six become a panel: numbered, vertical,
 * all visible together, with the contact routes at the bottom.
 *
 * The trigger is the word "Jump to" plus the current section rather than an
 * icon, deliberately. The site header collapses to a hamburger below `xl`, so
 * on a phone there are two menu controls side by side; a text label is what
 * keeps them from being mistaken for each other. It also preserves the "you are
 * here" signal that a menu would otherwise hide.
 *
 * The panel copies the header's focus handling rather than inventing a second
 * one: Escape closes, Tab cycles inside, background scroll locks, focus returns
 * to the trigger.
 *
 * Active section comes from an IntersectionObserver, not a scroll handler, so
 * there is no per-frame work. Links are plain anchors, so they work before
 * hydration and from the keyboard, and the global smooth scroll — already
 * disabled under prefers-reduced-motion — carries them.
 */

const SECTIONS = [
  { id: "what-you-get", label: "What you get" },
  { id: "product", label: "Product" },
  { id: "best-practice", label: "Best practice" },
  { id: "compliance", label: "Compliance" },
  { id: "segments", label: "Segments" },
  { id: "contact", label: "Contact" },
] as const;

export function CreatorNav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const activeLabel = SECTIONS.find((s) => s.id === active)?.label;

  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // Topmost section in document order wins, so the highlight does not
        // flicker between two sections that overlap mid-scroll.
        const current = SECTIONS.find((s) => visible.get(s.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-136px 0px -55% 0px" },
    );
    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // The desktop row can still scroll sideways on a narrow tablet, so keep the
  // active pill in view when it changes.
  useEffect(() => {
    if (!active || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`[data-section="${active}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div className="sticky top-18 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <nav aria-label="On this page" className="shell">
        {/* ---- md and up: every section visible ---- */}
        <ul
          ref={listRef}
          className="-mx-1 hidden items-center gap-1 overflow-x-auto py-2 md:flex
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SECTIONS.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  data-section={section.id}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3.5",
                    "text-[0.88rem] font-medium transition-colors duration-200",
                    isActive ? "bg-cyan-700 text-white" : "text-ink-2 hover:bg-mist hover:text-ink",
                  ].join(" ")}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* ---- below md: a labelled trigger, because six pills do not fit ---- */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-expanded={open}
          aria-controls="creator-sections"
          className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left md:hidden"
        >
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
              Jump to
            </span>
            <span className="truncate text-[0.95rem] font-semibold text-ink">
              {activeLabel ?? "Section"}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-mist text-cyan-700 ring-1 ring-line"
          >
            <ArrowDown size={16} />
          </span>
        </button>
      </nav>

      {/* ---- the panel ---- */}
      {open ? (
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Close section menu"
            onClick={close}
            className="fixed inset-0 z-40 cursor-default bg-ink/40 backdrop-blur-[2px]"
          />
          <div
            id="creator-sections"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Page sections"
            className="fixed inset-x-3 top-[8.75rem] z-50 max-h-[calc(100dvh-10rem)] overflow-y-auto
                       rounded-3xl bg-white p-3 shadow-[0_30px_70px_-25px_rgb(6_34_49/0.5)] ring-1 ring-line"
          >
            <div className="flex items-center justify-between px-2 pb-1 pt-1">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
                On this page
              </span>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-mist hover:text-ink"
              >
                <Close size={18} />
                <span className="sr-only">Close section menu</span>
              </button>
            </div>

            <ul>
              {SECTIONS.map((section, i) => {
                const isActive = active === section.id;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => setOpen(false)}
                      className={[
                        "flex min-h-14 items-center gap-3.5 rounded-2xl px-2.5",
                        "transition-colors duration-200",
                        isActive ? "bg-tint" : "hover:bg-mist",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden="true"
                        className={[
                          "text-[0.72rem] font-semibold tabular-nums",
                          isActive ? "text-cyan-700" : "text-ink-3",
                        ].join(" ")}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={[
                          "flex-1 text-[1.05rem] font-semibold",
                          isActive ? "text-cyan-700" : "text-ink",
                        ].join(" ")}
                      >
                        {section.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={[
                          "inline-flex size-8 shrink-0 items-center justify-center rounded-xl",
                          isActive ? "bg-cyan-700 text-white" : "bg-mist text-cyan-700",
                        ].join(" ")}
                      >
                        <ArrowRight size={15} />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Contact routes, so the panel can also end a visit rather than
                only move it along. */}
            <div className="mt-2 border-t border-line px-2.5 pb-1 pt-4">
              <div className="flex items-center gap-2.5">
                {links.instagram ? (
                  <a
                    href={links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full ring-1 ring-line transition-colors hover:bg-mist"
                  >
                    <InstagramColor size={20} />
                    <span className="sr-only">Vygor on Instagram</span>
                  </a>
                ) : null}
                {links.tiktok ? (
                  <a
                    href={links.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full ring-1 ring-line transition-colors hover:bg-mist"
                  >
                    <TiktokColor size={20} />
                    <span className="sr-only">Vygor on TikTok</span>
                  </a>
                ) : null}
              </div>
              <a
                href={`mailto:${partnersEmail}`}
                className="mt-3 inline-flex min-h-11 items-center text-[0.92rem] font-semibold text-cyan-700 underline decoration-cyan-700/30 underline-offset-4"
              >
                {partnersEmail}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

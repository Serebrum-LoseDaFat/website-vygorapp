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
 * WHY A LEFT RAIL AND NOT A BAR
 *
 * This started as a horizontal bar pinned under the site header. It worked, but
 * it read as a second header stacked under the first: two full-width rows of
 * links in slightly different type, which looks like a mistake rather than a
 * hierarchy. A rail moves the section list onto a different axis from the site
 * nav, so the two stop competing, and it has room for the numbering and the
 * contact routes that the bar had nowhere to put.
 *
 * Below `lg` there is no room for a rail, so the same six become the trigger and
 * panel: numbered, vertical, all visible together. Same content, same order,
 * same numbering — only the container changes.
 *
 * The trigger is the words "Jump to" plus the current section, not an icon. The
 * site header collapses to a hamburger below `xl`, so on a phone there are two
 * menu controls near each other and a text label is what keeps them apart. It
 * also preserves the "you are here" signal a bare menu would hide.
 *
 * The panel copies the header's focus handling rather than inventing a second
 * one: Escape closes, Tab cycles inside, background scroll locks, focus returns
 * to the trigger.
 *
 * Active section comes from an IntersectionObserver, not a scroll handler, so
 * there is no per-frame work, and one piece of state drives the rail, the
 * trigger label and the panel together.
 */

const SECTIONS = [
  { id: "what-you-get", label: "What you get" },
  { id: "product", label: "Product" },
  { id: "best-practice", label: "Best practice" },
  { id: "compliance", label: "Compliance" },
  { id: "segments", label: "Segments" },
  { id: "contact", label: "Contact" },
] as const;

function SectionNumber({ index, active }: { index: number; active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "text-[0.72rem] font-semibold tabular-nums",
        active ? "text-cyan-700" : "text-ink-3",
      ].join(" ")}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

/** Instagram, TikTok and the partners address — shared by the rail and panel. */
function ContactRoutes({ compact = false }: { compact?: boolean }) {
  return (
    <>
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
        className={[
          "mt-3 inline-flex min-h-11 items-center font-semibold text-cyan-700",
          "underline decoration-cyan-700/30 underline-offset-4 transition-colors hover:decoration-cyan-700",
          compact ? "text-[0.92rem]" : "break-all text-[0.85rem]",
        ].join(" ")}
      >
        {partnersEmail}
      </a>
    </>
  );
}

export function CreatorNav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
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
      { rootMargin: "-120px 0px -55% 0px" },
    );
    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

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
    <>
      {/* ---------------- lg and up: the rail ---------------- */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:border-r lg:border-line lg:bg-white">
        {/* Sticks under the fixed site header and scrolls on its own if a short
            viewport cannot hold the whole list plus the contact routes. */}
        <nav
          aria-label="On this page"
          className="sticky top-18 max-h-[calc(100vh-4.5rem)] overflow-y-auto px-5 py-8"
        >
          <p className="px-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
            On this page
          </p>

          <ul className="mt-3">
            {SECTIONS.map((section, i) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={[
                      "group flex min-h-11 items-center gap-3 rounded-xl px-2.5",
                      "transition-colors duration-200",
                      isActive ? "bg-tint" : "hover:bg-mist",
                    ].join(" ")}
                  >
                    <SectionNumber index={i} active={isActive} />
                    <span
                      className={[
                        "flex-1 text-[0.95rem] font-semibold leading-snug",
                        isActive ? "text-cyan-700" : "text-ink-2 group-hover:text-ink",
                      ].join(" ")}
                    >
                      {section.label}
                    </span>
                    {isActive ? (
                      <span aria-hidden="true" className="text-cyan-700">
                        <ArrowRight size={14} />
                      </span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 border-t border-line px-2.5 pt-6">
            <ContactRoutes />
          </div>
        </nav>
      </aside>

      {/* ---------------- below lg: trigger + panel ---------------- */}
      <div className="sticky top-18 z-40 border-b border-line bg-white/85 backdrop-blur-md lg:hidden">
        <div className="shell">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="creator-sections"
            className="flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left"
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
        </div>
      </div>

      {open ? (
        <div className="lg:hidden">
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
                      <SectionNumber index={i} active={isActive} />
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

            <div className="mt-2 border-t border-line px-2.5 pb-1 pt-4">
              <ContactRoutes compact />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * In-page section navigation for /creators.
 *
 * This page only. It is by far the longest page on the site — product, craft,
 * compliance, seven segment playbooks and contact — and a creator arriving from
 * a DM usually wants one of those, not a scroll through all of them.
 *
 * Sits directly under the site header and stays pinned, so it is reachable from
 * anywhere on the page rather than only after scrolling past the hero.
 *
 * The active section is tracked with an IntersectionObserver rather than a
 * scroll handler: no per-frame work, and the top margin in `rootMargin` is what
 * makes a section count as "current" only once it clears both sticky bars. The
 * bottom margin keeps the last section from winning as soon as it peeks in.
 *
 * Navigation is plain anchors, so it works before hydration and with the
 * keyboard for free; `scroll-behavior: smooth` is already set globally and is
 * already disabled under prefers-reduced-motion.
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
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        // Topmost section in document order wins, so overlapping sections do
        // not make the highlight jump around mid-scroll.
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

  // On a narrow screen the bar scrolls sideways, so the active pill can end up
  // off-screen. Bring it back into view without moving the page vertically.
  useEffect(() => {
    if (!active || !listRef.current) return;
    const pill = listRef.current.querySelector<HTMLElement>(`[data-section="${active}"]`);
    pill?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  return (
    <div className="sticky top-18 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <nav aria-label="On this page" className="shell">
        <ul
          ref={listRef}
          className="-mx-1 flex items-center gap-1 overflow-x-auto py-2
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
                    isActive
                      ? "bg-cyan-700 text-white"
                      : "text-ink-2 hover:bg-mist hover:text-ink",
                  ].join(" ")}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

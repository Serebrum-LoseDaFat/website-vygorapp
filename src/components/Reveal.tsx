"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered fade-up.
 *
 * Deliberately not a motion library: one shared IntersectionObserver pattern
 * plus a CSS transition costs about a kilobyte and keeps the animation on the
 * compositor (opacity + translate only, never layout properties).
 *
 * Reduced motion is handled twice over — the global stylesheet collapses
 * transition durations, and `matchMedia` short-circuits the observer so the
 * element mounts in its final state instead of animating to it.
 */

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms. Keep cumulative delays under ~400ms. */
  delay?: number;
  /** Travel distance in px. Smaller for large blocks so nothing feels sluggish. */
  y?: number;
  as?: ElementType;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 18, as: Tag = "div", className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Honour reduced motion: show immediately, never observe.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      setShown(true);
      return;
    }

    // Already in view on load (above the fold) — skip the observer round trip.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      // Hook for the <noscript> override in layout.tsx: without JS the effect
      // below never runs, so this element would stay at opacity 0 forever.
      data-reveal=""
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translate3d(0, ${y}px, 0)`,
        transition: `opacity 620ms var(--ease-out-soft) ${delay}ms, transform 620ms var(--ease-out-soft) ${delay}ms`,
        willChange: shown ? undefined : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { StoreBadges } from "./StoreBadges";
import { ArrowRight, Close, Menu } from "./Icons";
import { Wordmark } from "./Wordmark";
import { links } from "@/lib/config";
import { nav } from "@/content/site";

/**
 * Sticky site header.
 *
 * Behaviours worth knowing about:
 *  - The bar only gains its backdrop after a little scroll, so the hero reads
 *    as full-bleed at the top of the page.
 *  - The mobile panel is a focus trap: Escape closes it, Tab cycles inside it,
 *    background scroll is locked, and focus returns to the trigger on close.
 *  - The only call to action is the App Store badge. There is no "Get Vygor"
 *    button and no web "Log In", because neither has a destination that isn't
 *    the store listing — a second differently-worded button pointing at the
 *    same place is just noise.
 *  - "For Business" sits quietly to the left of the badge and leaves for the
 *    existing vygor.health site, which holds all the B2B content. It is styled
 *    down on purpose: this is a consumer page, and the enterprise route should
 *    be findable without competing with the download.
 */

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const items = nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Lock background scroll, trap focus, and wire Escape while the panel is open.
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
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-line/70 bg-white/85 shadow-[0_1px_20px_-8px_rgb(6_34_49/0.18)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <a
        href="#main"
        className="sr-only rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10"
      >
        Skip to content
      </a>

      <div className="shell flex h-18 items-center justify-between gap-4">
        <Link
          href="/"
          className="-m-2 shrink-0 rounded-xl p-2 transition-opacity hover:opacity-80"
          aria-label="Vygor — home"
          onClick={() => setOpen(false)}
        >
          <Wordmark className="h-8 w-auto sm:h-9" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-[0.92rem] font-medium text-ink-2 transition-colors duration-200 hover:bg-mist hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          {links.business ? (
            <a
              href={links.business}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 rounded-full px-2 py-2 text-[0.9rem] font-medium text-ink-3 transition-colors duration-200 hover:text-cyan-700"
            >
              For Business
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
              />
            </a>
          ) : null}
          <StoreBadges height={44} />
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-mr-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-ink transition-colors duration-200 hover:bg-mist xl:hidden"
        >
          {open ? <Close size={24} /> : <Menu size={24} />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {/* Mobile panel. Kept mounted so the collapse animates, hidden from AT when shut. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        inert={!open}
        className={[
          "overflow-hidden border-t border-line bg-white transition-[max-height,opacity] duration-300 ease-[var(--ease-out-soft)] xl:hidden",
          open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Mobile" className="shell flex flex-col gap-1 overflow-y-auto py-5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="rounded-xl px-3 py-3.5 text-lg font-semibold text-ink transition-colors duration-200 hover:bg-mist"
            >
              {item.label}
            </Link>
          ))}

          {links.business ? (
            <a
              href={links.business}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="mt-1 inline-flex items-center gap-1.5 rounded-xl px-3 py-3.5 text-lg font-medium text-ink-2 transition-colors duration-200 hover:bg-mist"
            >
              For Business
              <ArrowRight size={17} />
            </a>
          ) : null}

          <div className="mt-4 border-t border-line pt-5">
            <StoreBadges height={54} />
          </div>
        </nav>
      </div>
    </header>
  );
}

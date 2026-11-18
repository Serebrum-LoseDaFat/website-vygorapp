"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Site-wide "how do you want to email us?" chooser.
 *
 * A bare mailto: link only works when the visitor has a desktop mail app set
 * up. Someone who lives in Gmail in the browser clicks it and nothing happens,
 * which reads as a broken button. So every mailto: link on the site opens this
 * dialog instead, with four routes: a Gmail draft, an Outlook on the web
 * draft, the default mail app, or copying the address.
 *
 * It is mounted once in the root layout and listens for clicks on any
 * a[href^="mailto:"], so no component needs to know about it. The links stay
 * real mailto: links, which means they still work if this script never loads
 * (and for screen readers, crawlers and middle-clicks). Subject and body are
 * read from the link and carried into every option.
 *
 * Opt a link out with data-plain-mailto. Links inside the dialog are ignored.
 */

type Draft = { to: string; subject: string; body: string };

function parseMailto(href: string): Draft | null {
  if (!href.toLowerCase().startsWith("mailto:")) return null;
  const rest = href.slice("mailto:".length);
  const q = rest.indexOf("?");
  const to = decodeURIComponent(q === -1 ? rest : rest.slice(0, q));
  const params = new URLSearchParams(q === -1 ? "" : rest.slice(q + 1));
  if (!to) return null;
  return { to, subject: params.get("subject") ?? "", body: params.get("body") ?? "" };
}

const enc = encodeURIComponent;

function gmailUrl(d: Draft) {
  let url = "https://mail.google.com/mail/?view=cm&fs=1&to=" + enc(d.to);
  if (d.subject) url += "&su=" + enc(d.subject);
  if (d.body) url += "&body=" + enc(d.body);
  return url;
}

function outlookUrl(d: Draft) {
  let url = "https://outlook.office.com/mail/deeplink/compose?to=" + enc(d.to);
  if (d.subject) url += "&subject=" + enc(d.subject);
  if (d.body) url += "&body=" + enc(d.body);
  return url;
}

function mailtoUrl(d: Draft) {
  const parts: string[] = [];
  if (d.subject) parts.push("subject=" + enc(d.subject));
  if (d.body) parts.push("body=" + enc(d.body));
  return "mailto:" + d.to + (parts.length ? "?" + parts.join("&") : "");
}

const optionClass =
  "block w-full rounded-2xl bg-tint p-4 text-left ring-1 ring-line transition-colors " +
  "hover:bg-mist hover:ring-cyan-600 cursor-pointer";

function Option({ href, title, detail, newTab, onPick }: {
  href: string;
  title: string;
  detail: string;
  newTab?: boolean;
  onPick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onPick}
      className={optionClass}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="block font-semibold text-ink">{title}</span>
      <span className="mt-1 block text-[0.88rem] leading-snug text-ink-2">{detail}</span>
    </a>
  );
}

export function EmailChooser() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addressRef = useRef<HTMLSpanElement>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Plain left clicks only: let cmd/ctrl/middle-click do what the browser does.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as Element | null;
      const link = target?.closest?.("a[href^='mailto:']") as HTMLAnchorElement | null;
      if (!link || link.closest("[data-email-chooser]") || link.hasAttribute("data-plain-mailto")) return;
      const parsed = parseMailto(link.getAttribute("href") ?? "");
      if (!parsed) return;
      event.preventDefault();
      setDraft(parsed);
      setCopied(false);
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) dialog.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => dialogRef.current?.close();

  const copy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.to);
      setCopied(true);
    } catch {
      // Clipboard refused: select the address so it can be copied by hand.
      const el = addressRef.current;
      const selection = window.getSelection();
      if (el && selection) {
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      data-email-chooser=""
      aria-labelledby="email-chooser-title"
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl bg-white p-0 text-ink shadow-[0_30px_70px_-25px_rgb(6_34_49/0.5)] ring-1 ring-line backdrop:bg-ink/45 backdrop:backdrop-blur-[2px]"
    >
      {draft ? (
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Email us
              </p>
              <h2 id="email-chooser-title" className="mt-2 text-[1.5rem] font-bold leading-tight text-ink">
                Pick how to send it
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[1.4rem] leading-none text-ink-2 ring-1 ring-line transition-colors hover:bg-mist hover:text-ink"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <p className="mt-3 leading-relaxed text-ink-2">
            Email{" "}
            <span ref={addressRef} className="font-semibold text-ink">
              {draft.to}
            </span>
            {draft.subject ? ". The subject line is filled in for you." : "."}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Option href={gmailUrl(draft)} newTab onPick={close} title="Gmail" detail="Opens a draft in a new tab" />
            <Option href={outlookUrl(draft)} newTab onPick={close} title="Outlook" detail="Outlook on the web, new tab" />
            <Option href={mailtoUrl(draft)} onPick={close} title="Mail app" detail="Your computer's default email app" />
            <button type="button" onClick={copy} className={optionClass}>
              <span className="block font-semibold text-ink">{copied ? "Copied" : "Copy address"}</span>
              <span className="mt-1 block text-[0.88rem] leading-snug text-ink-2">
                {copied ? "Paste it into any email app" : draft.to}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

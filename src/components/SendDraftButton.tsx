"use client";

import { useState } from "react";
import { ButtonLink } from "./Button";

/**
 * "Send a draft" in the Talk to us box on /creators.
 *
 * A bare mailto link does nothing on a computer with no email app set up, which
 * read as a broken button. So one click now does two things: the mailto opens a
 * new email where an app exists, and the address is copied to the clipboard,
 * with a short line confirming it, so everyone else can paste it into Gmail or
 * whatever they use.
 */
export function SendDraftButton({ href, email }: { href: string; email: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-7">
      <ButtonLink
        href={href}
        variant="primary"
        size="md"
        withArrow
        onClick={() => {
          navigator.clipboard?.writeText(email).then(
            () => setCopied(true),
            () => {},
          );
        }}
      >
        Send a draft
      </ButtonLink>
      <p aria-live="polite" className="mt-3 text-[0.85rem] leading-relaxed text-ink-2">
        {copied ? `${email} copied. If no email app opened, paste it into your email.` : null}
      </p>
    </div>
  );
}

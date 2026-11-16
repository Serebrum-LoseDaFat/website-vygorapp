"use client";

import { ButtonLink } from "./Button";

/**
 * "Apply to the program" on /creators.
 *
 * One click does two things: the mailto link opens a new email to the creators
 * inbox, and the page scrolls down to the "Talk to us" box (#contact) where the
 * address is shown. A visitor with no email app set up gets nothing from a bare
 * mailto link, so the scroll makes sure they still land on the address.
 */
export function ApplyButton({ href }: { href: string }) {
  return (
    <ButtonLink
      href={href}
      variant="primary"
      size="lg"
      withArrow
      onClick={() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      Apply to the program
    </ButtonLink>
  );
}

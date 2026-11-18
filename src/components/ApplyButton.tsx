import { ButtonLink } from "./Button";

/**
 * "Apply to the program" on /creators.
 *
 * A plain mailto: link to the creators inbox. The site-wide EmailChooser
 * (mounted in the root layout) catches the click and offers Gmail, Outlook on
 * the web, the mail app or copying the address, so this button no longer
 * scrolls the page to the Talk to us box.
 */
export function ApplyButton({ href }: { href: string }) {
  return (
    <ButtonLink href={href} variant="primary" size="lg" withArrow>
      Apply to the program
    </ButtonLink>
  );
}

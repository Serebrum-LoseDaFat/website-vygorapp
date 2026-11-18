import { ButtonLink } from "./Button";

/**
 * "Send a draft" in the Talk to us box on /creators.
 *
 * A plain mailto: link. The site-wide EmailChooser (mounted in the root
 * layout) catches the click and offers Gmail, Outlook on the web, the mail app
 * or copying the address, so this button no longer copies the address itself.
 * `email` is kept in the props so the page needs no change.
 */
export function SendDraftButton({ href }: { href: string; email?: string }) {
  return (
    <div className="mt-7">
      <ButtonLink href={href} variant="primary" size="md" withArrow>
        Send a draft
      </ButtonLink>
    </div>
  );
}

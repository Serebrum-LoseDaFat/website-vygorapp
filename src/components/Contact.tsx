import { Reveal } from "./Reveal";
import { ButtonLink } from "./Button";
import { Sparkle } from "./Icons";
import { contact } from "@/content/site";
import { supportEmail } from "@/lib/config";

/**
 * Support.
 *
 * One email address, not a form. This previously posted to /api/contact; that
 * route and its form component were removed along with it, since nothing else
 * used them. A mailto: has no "did that send?" ambiguity, needs no inbox
 * plumbing, and gives the sender their own copy of what they wrote.
 *
 * The three prompts are there so people know what is worth writing about —
 * "contact us" on its own tends to get used only for complaints.
 */

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 bg-tint py-20 sm:py-28"
    >
      <div className="shell">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              {contact.kicker}
            </p>
            <h2 id="contact-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
              {contact.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-ink-2">
              {contact.lead}
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2.5">
            {contact.prompts.map((prompt) => (
              <li
                key={prompt}
                className="rounded-full border border-line bg-white px-4 py-2 text-[0.95rem] font-medium text-ink-2 shadow-soft"
              >
                {prompt}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <ButtonLink href={`mailto:${supportEmail}`} variant="primary" size="lg">
              <Sparkle size={18} />
              {supportEmail}
            </ButtonLink>
            <p className="text-sm text-ink-3">{contact.footnote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

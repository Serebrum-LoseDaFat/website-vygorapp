import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col items-center justify-center py-28 text-center">
      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
        404
      </p>
      <h1 className="mt-4 max-w-lg text-[length:var(--text-h1)] text-ink">
        That page has moved on.
      </h1>
      <p className="mt-5 max-w-md leading-relaxed text-ink-2">
        The link may be out of date. Everything about Vygor is on the homepage.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" variant="primary" size="lg">
          Back to Vygor
        </ButtonLink>
        <ButtonLink href="/#faq" variant="secondary" size="lg">
          Read the FAQ
        </ButtonLink>
      </div>
    </section>
  );
}

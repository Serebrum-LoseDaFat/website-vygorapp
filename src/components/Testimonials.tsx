import { Reveal } from "./Reveal";
import { Quote } from "./Icons";
import { testimonials, hasTestimonials } from "@/content/testimonials";

/**
 * Customer reviews.
 *
 * Renders nothing at all when src/content/testimonials.ts is empty, which is
 * the state at launch — Vygor had one App Store rating and no written review,
 * and publishing an invented quote is not an option. Drop real reviews into
 * that file and this section, its nav link and its review markup all appear.
 *
 * The layout is built and ready: a lead quote plus a supporting grid, with
 * initials standing in wherever a reviewer photo is unavailable.
 */

function Avatar({ name, photo }: { name: string; photo?: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- reviewer photos are arbitrary uploads, not build-time assets
      <img
        src={photo}
        alt=""
        width={44}
        height={44}
        loading="lazy"
        className="size-11 shrink-0 rounded-full object-cover ring-1 ring-line"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-cyan-700 ring-1 ring-cyan-100"
    >
      {initials}
    </span>
  );
}

export function Testimonials() {
  if (!hasTestimonials) return null;

  const [lead, ...rest] = testimonials;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-24 py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cyan-700">
              Reviews
            </p>
            <h2 id="reviews-heading" className="mt-3 text-[length:var(--text-h2)] text-ink">
              What people say about Vygor.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <figure className="mt-12 rounded-[var(--radius-card)] bg-tint p-8 ring-1 ring-line sm:p-12">
            <Quote size={34} className="text-cyan-300" />
            <blockquote className="mt-5 text-[length:var(--text-h3)] font-medium leading-snug text-ink">
              {lead.quote}
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3.5">
              <Avatar name={lead.name} photo={lead.photo} />
              <span>
                <span className="block font-semibold text-ink">{lead.name}</span>
                <span className="block text-sm text-ink-3">
                  {[lead.context, lead.source].filter(Boolean).join(" · ")}
                </span>
              </span>
            </figcaption>
          </figure>
        </Reveal>

        {rest.length > 0 ? (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, i) => (
              <Reveal as="li" key={item.name + i} delay={i * 70}>
                <figure className="flex h-full flex-col rounded-[var(--radius-card)] bg-white p-7 shadow-soft ring-1 ring-line">
                  <blockquote className="flex-1 leading-relaxed text-ink-2">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Avatar name={item.name} photo={item.photo} />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{item.name}</span>
                      <span className="block text-xs text-ink-3">
                        {[item.context, item.source].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

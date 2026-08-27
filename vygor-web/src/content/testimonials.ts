/**
 * Customer reviews.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS ARRAY IS INTENTIONALLY EMPTY.
 *
 * At build time Vygor's App Store listing showed a single rating and no
 * written review, so there is no real customer quote to publish. Inventing
 * one would be a fabricated endorsement, so the Reviews section simply does
 * not render while this array is empty — no placeholder cards, no fake names.
 *
 * TO TURN THE SECTION ON: paste real reviews into the array below. The
 * section, its heading, the nav link and the JSON-LD review markup all appear
 * automatically. Photos are optional; initials are used when `photo` is unset.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @example
 * export const testimonials: Testimonial[] = [
 *   {
 *     quote: "Paste the reviewer's own words here, unedited.",
 *     name: "Real Name",
 *     context: "Down 12 lb in 4 months",   // optional
 *     photo: "/testimonials/real-name.webp", // optional, 1:1 crop
 *     source: "App Store",                 // optional attribution
 *   },
 * ];
 */

export type Testimonial = {
  /** The reviewer's own words. Never paraphrase or compose these. */
  quote: string;
  name: string;
  /** Short goal or result, e.g. "Down 12 lb in 4 months". */
  context?: string;
  /** Square image in /public. Omit to render initials instead. */
  photo?: string;
  /** Where the review came from, e.g. "App Store". */
  source?: string;
};

export const testimonials: Testimonial[] = [];

export const hasTestimonials = testimonials.length > 0;

import { faqs } from "@/content/site";
import { testimonials } from "@/content/testimonials";
import { links, siteUrl } from "@/lib/config";
import { logo as brandLogo } from "@/content/screens";

/**
 * Structured data for the homepage.
 *
 * Only facts that are actually true and on the page are described. In
 * particular there is no `aggregateRating` — Vygor had a single App Store
 * rating at build time, and emitting a rating that thin would be misleading to
 * users and is exactly what Google's review-snippet guidelines warn against.
 * The block appears automatically once real reviews are added.
 */

export function JsonLd() {
  const organization = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Vygor Health",
    url: siteUrl,
    logo: `${siteUrl}${brandLogo.src}`,
    ...(links.instagram || links.tiktok
      ? { sameAs: [links.instagram, links.tiktok].filter(Boolean) }
      : {}),
  };

  const app = {
    "@type": "MobileApplication",
    "@id": `${siteUrl}/#app`,
    name: "Vygor AI Wellness Coach",
    applicationCategory: "HealthApplication",
    // No minimum version stated pending confirmation.
    operatingSystem: "iOS",
    ...(links.appStore ? { installUrl: links.appStore } : {}),
    publisher: { "@id": `${siteUrl}/#organization` },
    description:
      "Vygor is a super app for weight management and wellness, with AI tools for meal planning, exercise plans, recipes and macro tracking.",
    // Free download with in-app purchases, per the App Store listing.
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "free",
    },
    ...(testimonials.length > 0
      ? {
          review: testimonials.map((t) => ({
            "@type": "Review",
            reviewBody: t.quote,
            author: { "@type": "Person", name: t.name },
          })),
        }
      : {}),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Vygor",
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, app, faqPage],
  };

  return (
    <script
      type="application/ld+json"
      // Content is authored locally, not user input; stringify escapes it safely.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

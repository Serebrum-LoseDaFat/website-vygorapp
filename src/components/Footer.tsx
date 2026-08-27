import Link from "next/link";
import { WordmarkOnDark } from "./Wordmark";
import { StoreBadges } from "./StoreBadges";
import { Instagram, Tiktok } from "./Icons";
import { links } from "@/lib/config";
import { disclaimer } from "@/content/site";

/**
 * Site footer.
 *
 * Link groups are filtered before render, so an unconfigured destination is
 * simply not listed — no "#" placeholders. Everything B2B and legal points at
 * the existing vygor.health site rather than being rebuilt here.
 *
 * Social is Instagram and TikTok only. LinkedIn was dropped deliberately: this
 * is a consumer site, and a LinkedIn link on it invites the wrong audience.
 *
 * The icons sit in the brand column under the store badge rather than tucked
 * beside the copyright line. They were in that bottom row and were being missed
 * entirely — 44px grey glyphs at the very foot of a long page read as legal
 * furniture, not as links worth following.
 *
 * The wellness disclaimer sits here rather than in a modal — the app carries
 * the same caveat on its AI-generated plans, and it belongs on the page that
 * markets them.
 */

type FooterLink = { label: string; href: string | null; external?: boolean };

const socials = [
  { label: "Instagram", href: links.instagram, Icon: Instagram },
  { label: "TikTok", href: links.tiktok, Icon: Tiktok },
].filter((s): s is { label: string; href: string; Icon: typeof Instagram } => Boolean(s.href));

export function Footer() {
  const groups: { title: string; items: FooterLink[] }[] = [
    {
      title: "Product",
      items: [
        { label: "Features", href: "/#features" },
        { label: "How it works", href: "/#how-it-works" },
        { label: "Why AI", href: "/#why-ai" },
        { label: "Pricing", href: "/#pricing" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Company",
      items: [{ label: "Support", href: "/#contact" }],
    },
    {
      title: "Business",
      items: [{ label: "Partner with us", href: links.business, external: true }],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy Policy", href: links.privacy, external: true },
        { label: "Terms of Service", href: links.terms, external: true },
      ],
    },
  ];

  return (
    <footer className="bg-deep text-white">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <Link
              href="/"
              className="inline-block rounded-lg transition-opacity hover:opacity-80"
              aria-label="Vygor — home"
            >
              <WordmarkOnDark className="h-9 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs leading-relaxed text-white/70">
              Personalized wellness, powered by AI.
            </p>
            <StoreBadges className="mt-7" height={48} />

            {socials.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-aqua-300">
                  Follow us
                </h2>
                <ul className="mt-3 flex items-center gap-3">
                  {socials.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-12 items-center justify-center rounded-full
                                   ring-1 ring-white/25 text-white transition-[background-color,transform]
                                   duration-200 hover:-translate-y-0.5 hover:bg-white/12"
                        aria-label={`Vygor on ${label} — opens in a new tab`}
                      >
                        <Icon size={22} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {groups.map((group) => {
              const items = group.items.filter((item) => item.href);
              if (items.length === 0) return null;

              return (
                <div key={group.title}>
                  <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-aqua-300">
                    {group.title}
                  </h2>
                  <ul className="mt-3 flex flex-col gap-0.5">
                    {items.map((item) => (
                      <li key={item.label}>
                        {item.external ? (
                          <a
                            href={item.href as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="-mx-2 inline-block rounded-lg px-2 py-1.5 text-[0.95rem] text-white/75 transition-colors duration-200 hover:text-white"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            href={item.href as string}
                            className="-mx-2 inline-block rounded-lg px-2 py-1.5 text-[0.95rem] text-white/75 transition-colors duration-200 hover:text-white"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mt-14 border-t border-white/12 pt-8">
          <p className="max-w-4xl text-[0.82rem] leading-relaxed text-white/60">{disclaimer}</p>

          <p className="mt-7 text-sm text-white/60">
            © {new Date().getFullYear()} Vygor Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

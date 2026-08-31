/**
 * Single source of truth for every destination that leaves this site.
 *
 * Rule: a blank value is not an error, it means "not connected yet". Consumers
 * check for `null` and hide the control rather than rendering something that
 * goes nowhere. Nothing in the UI hardcodes an external URL inline.
 *
 * WHY THERE ARE DEFAULTS HERE
 *
 * Originally every link came from an environment variable with no fallback.
 * That is correct for a destination nobody knows yet, but it made the whole
 * public identity of the site conditional on a deploy-time checklist — and the
 * first production deploy shipped without those variables set. The result was
 * silent and total: every App Store badge, the "For Business" link, both social
 * icons and the privacy and terms links simply vanished, with no error, no
 * failed build and nothing in the logs. The page looked finished and was
 * missing its only conversion path.
 *
 * So values that are permanent, public and already known now carry a default,
 * exactly as `siteUrl` and `supportEmail` always have. The environment variable
 * still wins when set, so staging or a rebrand can override any of them without
 * a code change; the default only decides what happens when nothing is
 * configured, and "nothing configured" should not mean "hide the download
 * button".
 *
 * `play` and `login` deliberately keep no default. There is no Android app and
 * no web sign-in, so blank is the honest answer and hiding those controls is
 * the correct behaviour rather than a failure.
 */

const DEFAULTS = {
  /**
   * The consumer site is deployed at vygor.app. This default used to be
   * vygor.health, which is a DIFFERENT site — the older enterprise one, still
   * live, and still linked from here as `business`. With the variable unset in
   * production every canonical tag, the sitemap and every Open Graph URL
   * pointed at that other site, which is exactly the signal that tells a search
   * engine this page is a duplicate of it.
   */
  site: "https://www.vygor.app",
  appStore: "https://apps.apple.com/us/app/vygor-ai-wellness-coach/id1565632505",
  privacy: "https://www.vygor.health/privacy-policy",
  terms: "https://www.vygor.health/terms-of-service",
  business: "https://www.vygor.health/",
  instagram: "https://www.instagram.com/vygorapp/",
  tiktok: "https://www.tiktok.com/@vygorapp",
  supportEmail: "hello@vygor.health",
  partnersEmail: "partners@vygor.health",
} as const;

function env(value: string | undefined, fallback: string | null = null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const siteUrl = env(process.env.NEXT_PUBLIC_SITE_URL, DEFAULTS.site) as string;

export const links = {
  /** Live iOS listing. */
  appStore: env(process.env.NEXT_PUBLIC_APP_STORE_URL, DEFAULTS.appStore),
  /** Not published yet — badge stays hidden until this is filled in. */
  play: env(process.env.NEXT_PUBLIC_PLAY_URL),
  /** No web sign-in exists today, so the nav control is hidden by default. */
  login: env(process.env.NEXT_PUBLIC_LOGIN_URL),
  privacy: env(process.env.NEXT_PUBLIC_PRIVACY_URL, DEFAULTS.privacy),
  terms: env(process.env.NEXT_PUBLIC_TERMS_URL, DEFAULTS.terms),
  /** The existing Vygor site, which carries all the enterprise content. */
  business: env(process.env.NEXT_PUBLIC_BUSINESS_URL, DEFAULTS.business),
  instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL, DEFAULTS.instagram),
  tiktok: env(process.env.NEXT_PUBLIC_TIKTOK_URL, DEFAULTS.tiktok),
} as const;

/** The one address the site exposes, for feedback, requests and problems. */
export const supportEmail = env(
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  DEFAULTS.supportEmail,
) as string;

/**
 * Where creators and influencers send drafts for review. Separate from
 * supportEmail on purpose: consumer support and partnership submissions go to
 * different people, and the creator page tells creators to expect a reply
 * within two working days — a promise the support inbox has not made.
 */
export const partnersEmail = env(
  process.env.NEXT_PUBLIC_PARTNERS_EMAIL,
  DEFAULTS.partnersEmail,
) as string;

/**
 * Where "Get Vygor" / "Get Started" point. Vygor is an app-first product, so
 * the conversion target is the store listing. If Android ever ships, the
 * generic /download hop can be introduced here without touching a component.
 */
export const primaryCtaHref = links.appStore ?? `mailto:${supportEmail}`;

/** True when at least one store badge can be rendered honestly. */
export const hasAnyStoreLink = Boolean(links.appStore || links.play);

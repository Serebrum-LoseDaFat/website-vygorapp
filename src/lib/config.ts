/**
 * Single source of truth for every destination that leaves this site.
 *
 * Rule: a blank value is not an error, it means "not connected yet". Consumers
 * check for `null` and hide the control rather than rendering something that
 * goes nowhere. Nothing in the UI hardcodes an external URL.
 */

function env(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const siteUrl =
  env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://www.vygor.health";

export const links = {
  /** Live iOS listing. */
  appStore: env(process.env.NEXT_PUBLIC_APP_STORE_URL),
  /** Not published yet — badge stays hidden until this is filled in. */
  play: env(process.env.NEXT_PUBLIC_PLAY_URL),
  /** No web sign-in exists today, so the nav control is hidden by default. */
  login: env(process.env.NEXT_PUBLIC_LOGIN_URL),
  privacy: env(process.env.NEXT_PUBLIC_PRIVACY_URL),
  terms: env(process.env.NEXT_PUBLIC_TERMS_URL),
  /** The existing Vygor site, which carries all the enterprise content. */
  business: env(process.env.NEXT_PUBLIC_BUSINESS_URL),
  instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  tiktok: env(process.env.NEXT_PUBLIC_TIKTOK_URL),
} as const;

/** The one address the site exposes, for feedback, requests and problems. */
export const supportEmail =
  env(process.env.NEXT_PUBLIC_SUPPORT_EMAIL) ?? "hello@vygor.health";

/**
 * Where "Get Vygor" / "Get Started" point. Vygor is an app-first product, so
 * the conversion target is the store listing. If Android ever ships, the
 * generic /download hop can be introduced here without touching a component.
 */
export const primaryCtaHref = links.appStore ?? `mailto:${supportEmail}`;

/** True when at least one store badge can be rendered honestly. */
export const hasAnyStoreLink = Boolean(links.appStore || links.play);

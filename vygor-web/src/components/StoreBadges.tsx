import Image from "next/image";
import { links } from "@/lib/config";
import { appStoreBadge } from "@/content/screens";

/**
 * App-store buttons.
 *
 * Uses Apple's official badge artwork as supplied, at its intrinsic aspect
 * ratio — the badge is trademark-licensed, so it is never recoloured, cropped
 * or redrawn, only scaled.
 *
 * The Google Play button only renders once NEXT_PUBLIC_PLAY_URL is set. Vygor
 * has no Android build today, so by default only the App Store shows and there
 * is no badge pointing nowhere.
 */

type Props = {
  className?: string;
  /** Badge height in px. Apple's guidance is a 40px minimum. */
  height?: number;
};

function PlayGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.6 2.3a1.7 1.7 0 0 0-.6 1.3v16.8c0 .5.2 1 .6 1.3l9-9.7-9-9.7Z" fill="#00D7FE" />
      <path d="m12.6 12 3.1-3.3-9.9-5.7a1.6 1.6 0 0 0-.6-.2l7.4 9.2Z" fill="#00F076" />
      <path d="m12.6 12-7.4 9.2c.2 0 .4-.1.6-.2l9.9-5.7-3.1-3.3Z" fill="#FE3A44" />
      <path d="m15.7 8.7-3.1 3.3 3.1 3.3 4-2.3c1-.6 1-1.4 0-2l-4-2.3Z" fill="#FFC900" />
    </svg>
  );
}

export function StoreBadges({ className, height = 52 }: Props) {
  if (!links.appStore && !links.play) return null;

  const badgeWidth = Math.round((appStoreBadge.width / appStoreBadge.height) * height);

  return (
    <ul className={["flex flex-wrap items-center gap-3", className].filter(Boolean).join(" ")}>
      {links.appStore ? (
        <li>
          <a
            href={links.appStore}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block cursor-pointer rounded-xl transition-transform duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5"
            aria-label="Download Vygor on the App Store — opens the App Store in a new tab"
          >
            <Image
              src={appStoreBadge.src}
              alt="Download on the App Store"
              width={badgeWidth}
              height={height}
              sizes={`${badgeWidth}px`}
              className="block h-auto w-auto"
              style={{ height }}
            />
          </a>
        </li>
      ) : null}

      {links.play ? (
        <li>
          <a
            href={links.play}
            target="_blank"
            rel="noopener noreferrer"
            // Drawn to match the supplied Apple badge's proportions and radius.
            className="inline-flex cursor-pointer items-center gap-3 rounded-[0.55rem] bg-black px-4 text-white transition-transform duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5"
            style={{ height }}
            aria-label="Get Vygor on Google Play — opens Google Play in a new tab"
          >
            <PlayGlyph />
            <span className="text-left leading-tight">
              <span className="block text-[0.75rem] font-medium">GET IT ON</span>
              <span className="block text-[1.05rem] font-semibold tracking-tight">Google Play</span>
            </span>
          </a>
        </li>
      ) : null}
    </ul>
  );
}

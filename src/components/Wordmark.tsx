import Image from "next/image";
import { logo } from "@/content/screens";

/**
 * The Vygor Health logo, unmodified.
 *
 * Width and height come from the trimmed source file, so the intrinsic 2.994:1
 * aspect ratio is preserved exactly — the logo is never stretched, recoloured
 * or redrawn. Callers set the height only and let width follow.
 *
 * Not marked `priority` anywhere: it is a ~5 KB asset, and preloading it would
 * compete with the hero phone for the LCP slot for no real gain.
 */

export function Wordmark({
  className = "h-9 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logo.src}
      alt="Vygor Health"
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={className}
      sizes="160px"
    />
  );
}

/**
 * White-on-dark variant for the deep navy footer. The source logo is dark-blue
 * on transparent, so it is inverted via a filter rather than shipping a second
 * asset — brightness(0) flattens it to black, invert(1) lifts it to white.
 */
export function WordmarkOnDark({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <Image
      src={logo.src}
      alt="Vygor Health"
      width={logo.width}
      height={logo.height}
      className={`${className} brightness-0 invert`}
      sizes="160px"
    />
  );
}

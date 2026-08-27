import Image from "next/image";
import { screen } from "@/content/screens";

/**
 * Device frame around a real Vygor app screenshot.
 *
 * The bezel is CSS, not an image, so it stays crisp at any size and costs
 * nothing to download. The screenshots are 1290x2796 (iPhone 15 Pro), so the
 * inner aspect ratio is locked to that to prevent any letterboxing, and the
 * box is reserved before load so the frame never shifts the layout.
 *
 * NOTE ON POSITIONING: the root carries `relative` so the frame's own
 * absolutely-positioned parts have a containing block. Do NOT pass
 * `absolute` in `className` to move it — Tailwind emits `relative` after
 * `absolute`, so the override silently loses and the element stays in
 * normal flow. Wrap it in your own positioned <div> instead.
 */

type PhoneFrameProps = {
  /** Screen id from the generated asset manifest. */
  id: string;
  /**
   * Rendered CSS width. Applied as an inline style, so it CANNOT be overridden
   * by a `w-*` class in `className` — pass `widthClass` instead when the width
   * needs to change at a breakpoint. `width` is still required either way: it
   * feeds the `sizes` hint and acts as the fallback.
   */
  width?: number;
  /** Responsive width classes. When set, the inline width is dropped. */
  widthClass?: string;
  /** Overrides the `sizes` hint when `widthClass` makes the width responsive. */
  sizes?: string;
  /** Hero image on the first screenful should not be lazy-loaded. */
  priority?: boolean;
  className?: string;
  /** Set when a caption elsewhere already describes the screen. */
  decorative?: boolean;
};

export function PhoneFrame({
  id,
  width = 300,
  widthClass,
  sizes,
  priority = false,
  className,
  decorative = false,
}: PhoneFrameProps) {
  const asset = screen(id);

  return (
    <div
      className={[
        "relative shrink-0 rounded-[2.6rem] bg-deep p-[0.42rem]",
        "shadow-phone ring-1 ring-white/12",
        widthClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={widthClass ? { maxWidth: "100%" } : { width, maxWidth: "100%" }}
    >
      {/* Bezel highlight — a thin light edge reads as glass without a blur. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[2.6rem] bg-gradient-to-b from-white/22 via-transparent to-white/8"
      />

      <div className="relative overflow-hidden rounded-[2.25rem] bg-white">
        <Image
          src={asset.src}
          alt={decorative ? "" : asset.alt}
          aria-hidden={decorative || undefined}
          width={asset.width}
          height={asset.height}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          sizes={sizes ?? `${width}px`}
          className="block h-auto w-full"
          // The screenshots include the iOS status bar, so no extra chrome.
        />
      </div>

      {/* Dynamic island. Purely cosmetic framing over the screenshot's own bar. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[1.15rem] h-[1.05rem] w-[5.2rem] -translate-x-1/2 rounded-full bg-deep"
      />
    </div>
  );
}

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
 *
 * NOTE ON SIZE: the corner radius, bezel padding and dynamic island are
 * authored in rem for a 300px-wide frame. They do not shrink with `width`, so
 * a small frame gets a proportionally huge island — at 150px the island is 55%
 * of the phone's width instead of 27%, which reads as a toy rather than a
 * phone. Pass `proportional` to scale that geometry with `width`. It is opt-in
 * rather than automatic so existing 300px callers render byte-identically.
 */

/** Decorative geometry, expressed as a fraction of frame width at 300px. */
const GEO = {
  radius: 41.6 / 300,
  padding: 6.72 / 300,
  innerRadius: 36 / 300,
  islandTop: 18.4 / 300,
  islandHeight: 16.8 / 300,
  islandWidth: 83.2 / 300,
};

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
  /**
   * Scale the bezel, corner radius and dynamic island with `width` instead of
   * leaving them at their 300px sizes. Needs a numeric `width`; it is ignored
   * alongside `widthClass`, where the rendered width is not known here.
   */
  proportional?: boolean;
};

export function PhoneFrame({
  id,
  width = 300,
  widthClass,
  sizes,
  priority = false,
  className,
  decorative = false,
  proportional = false,
}: PhoneFrameProps) {
  const asset = screen(id);
  const scaled = proportional && !widthClass;

  const px = (fraction: number) => `${(width * fraction).toFixed(2)}px`;

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
      style={{
        maxWidth: "100%",
        ...(widthClass ? null : { width }),
        ...(scaled ? { borderRadius: px(GEO.radius), padding: px(GEO.padding) } : null),
      }}
    >
      {/* Bezel highlight — a thin light edge reads as glass without a blur. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[2.6rem] bg-gradient-to-b from-white/22 via-transparent to-white/8"
        style={scaled ? { borderRadius: px(GEO.radius) } : undefined}
      />

      <div
        className="relative overflow-hidden rounded-[2.25rem] bg-white"
        style={scaled ? { borderRadius: px(GEO.innerRadius) } : undefined}
      >
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
        style={
          scaled
            ? {
                top: px(GEO.islandTop),
                height: px(GEO.islandHeight),
                width: px(GEO.islandWidth),
              }
            : undefined
        }
      />
    </div>
  );
}

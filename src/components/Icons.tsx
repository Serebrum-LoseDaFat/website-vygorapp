/**
 * Inline SVG icon set (Lucide-style geometry, 24x24, 1.75 stroke).
 *
 * Inlined rather than pulled from a package: the site uses a dozen glyphs, so
 * a dependency would ship far more than it saves. Icons are decorative unless
 * a `title` is passed — they inherit colour from `currentColor` and size from
 * the `size` prop so they always match the text beside them.
 */

type IconProps = {
  className?: string;
  size?: number;
  /** Supply only when the icon is the sole meaning-carrier. */
  title?: string;
};

function Svg({
  children,
  className,
  size = 20,
  title,
  filled = false,
}: IconProps & { children: React.ReactNode; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </Svg>
);

export const ArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </Svg>
);

export const Menu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Apple = (p: IconProps) => (
  <Svg {...p} filled>
    <path d="M17.05 12.54c.02-2.2 1.79-3.26 1.87-3.31-1.02-1.5-2.61-1.7-3.17-1.73-1.35-.14-2.63.79-3.32.79-.69 0-1.75-.77-2.87-.75-1.48.02-2.84.86-3.6 2.18-1.54 2.67-.39 6.62 1.11 8.79.74 1.06 1.61 2.25 2.76 2.21 1.1-.04 1.52-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.95-1.08 2.68-2.15.84-1.22 1.19-2.41 1.21-2.47-.03-.01-2.31-.89-2.41-3.54ZM14.9 5.83c.6-.73 1.01-1.75.9-2.76-.89.04-1.97.59-2.6 1.32-.57.65-1.06 1.69-.93 2.68.99.08 1.99-.5 2.63-1.24Z" />
  </Svg>
);

export const Heart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.7a4.1 4.1 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20Z" />
  </Svg>
);

export const Shield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l7 3v6c0 4.2-2.9 7.8-7 9-4.1-1.2-7-4.8-7-9V6l7-3Z" />
    <path d="m9.2 12.2 1.9 1.9 3.7-3.7" />
  </Svg>
);

export const Devices = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="5" width="12" height="10" rx="1.6" />
    <path d="M6 19h6" />
    <rect x="16.5" y="8.5" width="5" height="10.5" rx="1.6" />
  </Svg>
);

export const Download = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v11M7.5 10 12 14.5 16.5 10" />
    <path d="M4.5 17.5V19a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.5" />
  </Svg>
);

export const Utensils = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3v7a2.5 2.5 0 0 0 5 0V3M8.5 12.5V21" />
    <path d="M16.5 3c1.7 1.2 2.5 3 2.5 5s-.8 3.3-2 4v9" />
  </Svg>
);

export const Activity = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12h3.5l2.5-7 4 14 2.5-7H21" />
  </Svg>
);

export const Chart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20V10M10 20V4M16 20v-6M22 20H2" />
  </Svg>
);

export const Sparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
    <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
  </Svg>
);

export const Instagram = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.6" />
    <circle cx="12" cy="12" r="3.6" />
    <path d="M17 7.2h.01" />
  </Svg>
);

export const Tiktok = (p: IconProps) => (
  <Svg {...p} filled>
    <path d="M16.6 2h-2.9v11.9a2.2 2.2 0 1 1-2.2-2.2c.24 0 .47.04.69.11V8.85a5.3 5.3 0 0 0-.69-.05 5.1 5.1 0 1 0 5.1 5.1V8.06a6.3 6.3 0 0 0 3.7 1.2V6.34a3.7 3.7 0 0 1-3.7-3.7V2Z" />
  </Svg>
);

export const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Svg>
);

export const Quote = (p: IconProps) => (
  <Svg {...p} filled>
    <path d="M9.4 6C6.6 7.3 5 9.7 5 12.9V18h5.3v-5.2H7.8c0-2 .8-3.5 2.4-4.4L9.4 6Zm8.4 0c-2.8 1.3-4.4 3.7-4.4 6.9V18H19v-5.2h-2.6c0-2 .8-3.5 2.4-4.4L17.8 6Z" />
  </Svg>
);

/* -------------------------------------------------------------------------
   Full-colour platform marks.
   
   Drawn rather than imported. The supplied logo files were a JPEG and a WebP
   with no alpha channel — the transparent checkerboard from the source preview
   was baked into the pixels, so both would have sat in a pale grey box on the
   tinted hero. Vector also stays crisp at any size and adds no image request.
   
   Sized in ems so one `size` prop scales the whole mark.
   ------------------------------------------------------------------------- */

/** Instagram glyph on its brand gradient. */
export const InstagramColor = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Instagram">
    <defs>
      <radialGradient id="ig-g" cx="0.3" cy="1.05" r="1.25">
        <stop offset="0" stopColor="#FFD776" />
        <stop offset="0.28" stopColor="#F3A145" />
        <stop offset="0.52" stopColor="#EE5D4E" />
        <stop offset="0.72" stopColor="#D6266E" />
        <stop offset="1" stopColor="#7B3FE4" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="7" fill="url(#ig-g)" />
    <rect
      x="5.1"
      y="5.1"
      width="13.8"
      height="13.8"
      rx="4.4"
      fill="none"
      stroke="#fff"
      strokeWidth="1.7"
    />
    <circle cx="12" cy="12" r="3.5" fill="none" stroke="#fff" strokeWidth="1.7" />
    <circle cx="16.6" cy="7.5" r="1.15" fill="#fff" />
  </svg>
);

/** TikTok note, with the cyan and red offsets that make the mark recognisable. */
export const TiktokColor = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="TikTok">
    <rect width="24" height="24" rx="7" fill="#010101" />
    <g transform="translate(0.55 -0.35)">
      <path
        d="M16.1 5.6h-2.6v10.7a2 2 0 1 1-2-2c.22 0 .43.03.63.1v-2.7a4.7 4.7 0 1 0 4.05 4.65V9.9a5.7 5.7 0 0 0 3.35 1.08V8.3a3.35 3.35 0 0 1-3.35-3.35v.65Z"
        fill="#25F4EE"
      />
      <path
        d="M17.1 6.4h-2.6v10.7a2 2 0 1 1-2-2c.22 0 .43.03.63.1v-2.7a4.7 4.7 0 1 0 4.05 4.65V10.7a5.7 5.7 0 0 0 3.35 1.08V9.1a3.35 3.35 0 0 1-3.35-3.35v.65Z"
        fill="#FE2C55"
      />
      <path
        d="M16.6 6h-2.6v10.7a2 2 0 1 1-2-2c.22 0 .43.03.63.1v-2.7a4.7 4.7 0 1 0 4.05 4.65V10.3a5.7 5.7 0 0 0 3.35 1.08V8.7a3.35 3.35 0 0 1-3.35-3.35V6Z"
        fill="#fff"
      />
    </g>
  </svg>
);

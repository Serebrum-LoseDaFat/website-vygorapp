import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * The one button in the system. Renders as a real <a> (via next/link for
 * internal hops) or a real <button> depending on what it does — never a div
 * with a click handler, so keyboard and assistive tech get it for free.
 *
 * If `href` is null the component renders nothing. That is deliberate: every
 * destination comes from src/lib/config.ts, and an unconfigured destination
 * should make the control disappear rather than become a dead end.
 */

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const base =
  "group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold " +
  "whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color] duration-200 " +
  "ease-[var(--ease-out-soft)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // Gradient ends at cyan-700, so white text clears 4.8:1 across the whole fill.
  primary:
    "brand-gradient text-white shadow-[0_2px_6px_rgb(1_94_140/0.24),0_14px_30px_-10px_rgb(1_94_140/0.5)] " +
    "hover:-translate-y-0.5 hover:shadow-[0_4px_10px_rgb(1_94_140/0.28),0_20px_42px_-12px_rgb(1_94_140/0.55)]",
  secondary:
    "border border-line-strong bg-white text-ink hover:border-cyan-600 hover:text-cyan-700 " +
    "hover:-translate-y-0.5 hover:shadow-soft",
  ghost: "text-ink-2 hover:bg-mist hover:text-ink",
  // For the deep navy beds: white pill, dark label (16.4:1 inverted).
  onDark:
    "bg-white text-ink hover:-translate-y-0.5 hover:bg-aqua-200 " +
    "shadow-[0_14px_34px_-12px_rgb(0_0_0/0.45)]",
};

const sizes: Record<Size, string> = {
  // 44px min touch target at md, 52px at lg.
  md: "min-h-11 px-5 text-[0.95rem]",
  lg: "min-h-13 px-7 text-base sm:text-[1.05rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Renders a trailing arrow that nudges on hover. */
  withArrow?: boolean;
};

type AsLink = CommonProps & {
  href: string | null | undefined;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

type AsButton = CommonProps & Omit<ComponentProps<"button">, "className" | "children">;

function cls(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

function Arrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function ButtonLink({
  href,
  external,
  variant = "primary",
  size = "md",
  className,
  children,
  withArrow,
  ...rest
}: AsLink) {
  // Unconfigured destination: render nothing rather than a dead control.
  if (!href) return null;

  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
  const classNames = cls(variant, size, className);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classNames}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...rest}
      >
        {children}
        {withArrow ? <Arrow /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames} {...rest}>
      {children}
      {withArrow ? <Arrow /> : null}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  withArrow,
  type = "button",
  ...rest
}: AsButton) {
  return (
    <button type={type} className={cls(variant, size, className)} {...rest}>
      {children}
      {withArrow ? <Arrow /> : null}
    </button>
  );
}

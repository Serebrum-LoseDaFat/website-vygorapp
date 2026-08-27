import { PhoneFrame } from "./PhoneFrame";

/**
 * The hero product visual: two complete phones, nothing overlaid.
 *
 * WHY TWO PHONES
 * --------------
 * This replaces a single phone with UI cards floated over it. That approach was
 * abandoned rather than tuned again: a card cropped out of a screenshot and
 * placed back over it can only ever be *approximately* aligned, it hides the
 * screen it is meant to sell, and it reads as unrelated images stacked up.
 *
 * Two complete screens carry more of the product and have no alignment to get
 * wrong — each phone is one self-contained asset. Phone 1 is the home dashboard
 * (primary: larger, in front). Phone 2 is the contest board (secondary: smaller,
 * set back and down).
 *
 * INVARIANTS
 * ----------
 *  - No `rotate`, `scale`, mirror or 3D transform touches either phone. The
 *    only motion is a vertical drift, so the UI can never render mirrored or
 *    inverted. (The home screenshot IMG_9973 is stored upside-down at source;
 *    that is corrected once in the asset pipeline, never with a CSS transform.)
 *  - Aspect ratio comes from each screenshot's own intrinsic dimensions via
 *    PhoneFrame. Nothing is stretched or cropped to fit a container.
 *  - Offsets are in `rem`, not percentages of a sibling, so the overlap is the
 *    same proportion at every breakpoint and can be reasoned about directly.
 *  - The secondary's overhang is mirrored as left padding on the wrapper, so
 *    `justify-center` centres the *pair* rather than the primary phone. Without
 *    that the whole composition sits visibly off-centre on small screens.
 *  - Overlap is ~11% on desktop and tablet: enough for the two to read as one
 *    object, little enough that the contest card's dates, gauge and countdown
 *    stay legible. On a 375px screen the pair is already using the full width,
 *    so overlap there settles near 28% — it falls on the secondary's right
 *    edge, past the countdown, which is the least costly place to lose.
 */

/** Vertical drift only — never a rotation. Phases differ so they do not march. */
const DRIFT = {
  primary: { "--tilt": "0deg", "--drift": "10px", "--float-duration": "9s", "--float-delay": "0s" },
  secondary: {
    "--tilt": "0deg",
    "--drift": "13px",
    "--float-duration": "11s",
    "--float-delay": "-3.5s",
  },
} as const;

export function HeroPhones() {
  return (
    // Left padding equals the secondary's overhang, so the absolutely
    // positioned secondary has room instead of spilling out of the column.
    // Bottom padding clears the secondary, which hangs below the primary.
    <div
      className="relative flex justify-center
                 pb-14 pl-[7.75rem] sm:pl-[10.75rem] lg:pb-20 lg:pl-[12.5rem]"
    >
      <div className="relative">
        {/* ---- Phone 2 — contest board. Behind, lower, lightly overlapped. ---- */}
        <div
          className="float-slow absolute bottom-[-6%] left-[-7.75rem] z-0
                     sm:bottom-[-7%] sm:left-[-10.75rem] lg:bottom-[-9%] lg:left-[-12.5rem]"
          style={DRIFT.secondary as React.CSSProperties}
        >
          <PhoneFrame
            id="contests"
            width={224}
            widthClass="w-[10.75rem] sm:w-[12.25rem] lg:w-[14rem]"
            sizes="(max-width: 640px) 172px, (max-width: 1024px) 196px, 224px"
          />
        </div>

        {/* ---- Phone 1 — home dashboard. Front and dominant. ---- */}
        <div className="float-slow relative z-10" style={DRIFT.primary as React.CSSProperties}>
          <PhoneFrame
            id="home"
            width={288}
            widthClass="w-[13.5rem] sm:w-[15.75rem] lg:w-[18rem]"
            sizes="(max-width: 640px) 216px, (max-width: 1024px) 252px, 288px"
            priority
          />
        </div>
      </div>
    </div>
  );
}

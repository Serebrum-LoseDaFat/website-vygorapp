/**
 * The free tools directory.
 *
 * Each tool is a standalone, self-contained HTML document served verbatim by
 * its own route handler under /tools/<slug> — supplied finished and optimised
 * for that exact URL, not rebuilt as a React page. This file is only the
 * directory: the copy the /tools index renders about each one. Adding a tool
 * means dropping its document in src/content/tools/, adding a route handler,
 * and adding an entry here.
 *
 * These pages exist to be found in search and to be shared, so the entries are
 * written the way someone would type the question — "how many calories should
 * I eat to lose weight" — rather than in product language. `outputs` lists what
 * the tool actually returns, which is the honest version of a feature list and
 * the thing that decides whether the click is worth it.
 *
 * Keep `href` a plain string, not a config lookup. These are our own routes;
 * they cannot be unconfigured, and they must never disappear the way an
 * external destination is allowed to.
 */

export type ToolIcon = "chart" | "utensils" | "activity";

export type Tool = {
  /** Last path segment under /tools. Must match the route handler directory. */
  slug: string;
  name: string;
  /** One line, in the visitor's words. Sits under the name on the card. */
  tagline: string;
  /** Two sentences at most — what it does and what it is based on. */
  blurb: string;
  /** The numbers or artefacts the tool hands back. */
  outputs: readonly string[];
  icon: ToolIcon;
};

export const toolsIntro = {
  kicker: "Free tools",
  title: "Free tools to plan your weight loss.",
  lead:
    "Quick, no-signup calculators that give you the numbers a plan is built on. " +
    "Nothing to install, nothing to fill in but the question you came with.",
  /**
   * Stated plainly because it is the single most common hesitation on a page
   * like this, and because it is true: the calculators run entirely in the
   * browser and post nothing anywhere.
   */
  note: "No account, no email, no data leaves your device.",
} as const;

export const tools: readonly Tool[] = [
  {
    slug: "weight-loss-calculator",
    name: "Weight Loss Calculator",
    tagline: "How many calories to reach your goal weight — and by when.",
    blurb:
      "Enter your age, height, weight, goal and activity level to get your BMR, daily calorie needs and a " +
      "calorie target. The timeline uses a dynamic energy-balance model, so it curves as your needs drop " +
      "instead of assuming a straight line.",
    outputs: [
      "BMR from the Mifflin-St Jeor equation",
      "TDEE for your activity level",
      "A daily calorie target with a safety floor",
      "A projected date for your goal weight",
      "Imperial or metric units",
    ],
    icon: "chart",
  },
];

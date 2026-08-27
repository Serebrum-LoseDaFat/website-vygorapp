import generated from "./screens.generated.json";

/**
 * Typed accessor over the asset manifest written by `npm run assets`.
 *
 * Two kinds of product image:
 *  - **screens** — full app screenshots exported at 1080px, shown inside the
 *    CSS `PhoneFrame`.
 * Intrinsic dimensions live here so every image reserves its exact box before
 * it loads, which is what keeps CLS at zero.
 */

export type ScreenId = keyof typeof generated.screens;
export type CompositeId = keyof typeof generated.composites;

type ScreenAsset = { src: string; width: number; height: number };

const screens = generated.screens as Record<string, ScreenAsset>;
const composites = generated.composites as Record<string, ScreenAsset>;

/** Human-readable alt text. Describes what is on screen, not "screenshot of". */
const ALT: Record<string, string> = {
  home: "The Vygor home screen showing a daily snapshot of current weight, goal, BMI, steps and body fat above shortcuts to the macro tracker, dietitian, trainer and recipes.",
  "meal-plan":
    "A Vygor meal plan for the day, with calorie, carb, protein and fat totals above each planned meal.",
  recipes:
    "The Vygor recipe library, showing AI-curated recipes with photos and tabs for recipes, videos and favourites.",
  "recipe-detail":
    "A Vygor recipe for an avocado cucumber chaat salad, with cook time, calories, dietary tags and a macro breakdown.",
  "recipe-videos":
    "The videos tab of the Vygor recipe library, listing featured recipe videos with durations and view counts.",
  "macro-tracker":
    "The Vygor macro tracker, with options to log a meal by photo, gallery, barcode or by typing it.",
  coach:
    "The Vygor AI wellness coach reviewing a logged roast chicken meal, with its calories, macros and editable ingredient list.",
  "exercise-plan":
    "A Vygor exercise plan listing a warm-up, main workout with sets and reps, and a cool-down, with the equipment needed.",
  contests:
    "The Vygor home screen showing a weight trend chart above a live weight contest with its progress gauge and days remaining.",
  analytics:
    "Vygor cardio analytics showing daily step counts as a bar chart, alongside distance, VO2 max and walking and running speed.",
};


/**
 * Hand-composed product shots for the features section: a complete phone with
 * its pop-out card already laid out in the artwork. Rendered bare — they carry
 * their own device frame, so PhoneFrame must not be wrapped around them.
 */
const COMPOSITE_ALT: Record<string, string> = {
  "c-dietitian":
    "A Vygor meal plan for the day, with the calorie, carb, protein and fat totals lifted out of the screen.",
  "c-recipes":
    "The Vygor recipe library, with its recipes, videos and favourites tabs lifted out of the screen.",
  "c-macros":
    "The Vygor macro tracker, with the options to log a meal by photo, gallery, barcode or typing lifted out of the screen.",
  "c-trainer":
    "A Vygor exercise plan, with a 330 calorie and 40 minute session summary lifted out of the screen.",
  "c-contests":
    "The Vygor home screen, with a live weight contest showing +1.7 kg and 68 days left lifted out of the screen.",
  "c-analytics":
    "Vygor cardio analytics, with a daily step-count bar chart lifted out of the screen.",
};

export function composite(id: CompositeId | string) {
  const asset = composites[id];
  if (!asset) {
    throw new Error(
      `Unknown composite "${id}". Add it to COMPOSITES in scripts/build-assets.mjs and re-run "npm run assets".`,
    );
  }
  return { ...asset, alt: COMPOSITE_ALT[id] ?? "A Vygor app screen." };
}

export function screen(id: ScreenId | string) {
  const asset = screens[id];
  if (!asset) {
    throw new Error(
      `Unknown screen "${id}". Add it to SCREENS in scripts/build-assets.mjs and re-run "npm run assets".`,
    );
  }
  return { ...asset, alt: ALT[id] ?? "A Vygor app screen." };
}


/**
 * The logo, at its trimmed intrinsic aspect ratio. Filenames are content-hashed
 * by the asset pipeline, so the src comes from the manifest rather than being
 * written out here.
 */
export const logo = generated.logo;

/** Favicon / apple-touch icon, referenced from layout metadata. */
export const icon = generated.icon;

/** The Vygor leaf mark, used once as large editorial punctuation. */
export const leafMark = generated.leafMark;

/** Apple's official App Store badge artwork, as supplied. */
export const appStoreBadge = generated.appStoreBadge;

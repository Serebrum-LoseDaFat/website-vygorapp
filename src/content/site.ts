/**
 * All homepage copy in one place.
 *
 * Factual guardrail: every product claim here is traceable either to the
 * Vygor App Store listing (apps.apple.com/us/app/vygor-ai-wellness-coach/
 * id1565632505) or to the shipped app screens in /public/app. No ratings,
 * user counts, outcomes or reviews are invented. OS version numbers are
 * deliberately not stated anywhere pending confirmation.
 *
 * WHO THIS PAGE IS WRITTEN FOR
 * ----------------------------
 * The copy is aimed at one person: 35–55, US, working and time-poor, often a
 * parent. Around 200 lb / 90 kg if a man, 180 lb / 80 kg if a woman — the US
 * averages — so overweight to obese by BMI. Health-conscious and often
 * prediabetic or worried about becoming so. Has tried tracking apps and diets
 * before and stopped. Does not want to become a nutrition expert; wants to be
 * told what to eat and what to do, in a way that survives a bad week.
 *
 * That profile is why the headings avoid AI jargon and product-speak ("five AI
 * systems") in favour of what the reader actually gets — a dietitian, a
 * trainer, and the decisions made for them.
 */

export const nav = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Why AI", href: "/#why-ai" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Support", href: "/#contact" },
] as const;

export const hero = {
  eyebrow: "Weight management & wellness, in one app",
  /**
   * Deliberately promises management, not an outcome.
   *
   * The previous line ("Eat better, train smarter, lose the weight.") promised
   * weight loss, which is a result no app can guarantee and which the team
   * decided not to claim. "Lasts" carries the real differentiator instead — the
   * plan adapts rather than resetting — without asserting a medical outcome.
   */
  title: "Weight management that lasts.",
  /** Rendered with the brand gradient; must appear verbatim in `title`. */
  accent: "that lasts.",
  lead:
    "Vygor is a super app for weight management and wellness, with human-driven AI tools for meal planning, exercise plans, recipes and macro tracking.",
  /** Sits directly under the device in the hero. */
  caption: "Built to make healthy habits easier to stick with.",
};

/**
 * The six tools inside Vygor.
 *
 * `composite` is a hand-composed product shot — a complete phone with its
 * pop-out card already laid out in the artwork — and is what the features
 * section renders. `screen` is the plain screenshot behind it, kept because
 * other sections still use it and it is the fallback if a composite is dropped.
 */
export const modules = [
  {
    id: "dietitian",
    name: "AI Dietitian",
    headline: "Know what to eat.",
    body:
      "Meal plans generated for your goals rather than a generic template, laid out day by day with the calories, carbs, protein and fat already worked out. They adjust on their own as your weight, activity and preferences change.",
    points: ["A full day of meals, planned", "Calories and macros per meal", "Adapts as your goals move"],
    screen: "meal-plan",
    composite: "c-dietitian",
    tone: "cyan",
  },
  {
    id: "recipes",
    name: "AI Recipes",
    headline: "Something you'll actually cook.",
    body:
      "Ask Vygor for a recipe and it generates one around your macros and taste, with ingredients, steps and nutrition on a single card. There is a video library alongside it for when you would rather be shown than told.",
    points: [
      "Generate a recipe from your own request",
      "Ingredients, method and nutrition together",
      "Watch recipe videos in the app",
    ],
    screen: "recipes",
    composite: "c-recipes",
    tone: "leaf",
  },
  {
    id: "macros",
    name: "AI Macro Tracker",
    headline: "Log it with a photo.",
    body:
      "Photograph the plate, scan a barcode, pick from your gallery or just type it. Vygor works out the calories, carbs, protein and fat and folds them into your day — no scrolling through a database to find your lunch.",
    points: ["Photo, barcode, gallery or text", "Full macro breakdown", "Synced straight to your plan"],
    screen: "macro-tracker",
    composite: "c-macros",
    tone: "aqua",
  },
  {
    id: "trainer",
    name: "AI Trainer",
    headline: "Know how to move.",
    body:
      "A session built around your fitness level and the equipment you actually have — warm-up, main workout and cool-down, with sets and reps set out. It changes session to session as you get stronger.",
    points: ["Warm-up, main set and cool-down", "Built for your equipment", "Progresses with you"],
    screen: "exercise-plan",
    composite: "c-trainer",
    tone: "cyan",
  },
  {
    id: "contests",
    name: "Contests",
    headline: "Don't do it alone.",
    body:
      "The hard part of getting healthier is not knowing what to do — it is keeping going. Contests put friends and family alongside you with a shared start date, a target and a countdown, which is what tends to carry a habit past the point most people quit.",
    points: ["Contests with friends and family", "A shared target and countdown", "Support past the drop-off point"],
    screen: "contests",
    composite: "c-contests",
    tone: "sage",
  },
  {
    id: "analytics",
    name: "Analytics",
    headline: "See what's actually working.",
    body:
      "Weight, BMI and body-fat trends across days, weeks and months, next to steps, distance, VO2 max and pace. A weekly report reads your own numbers back to you, so you can tell a plateau from a bad week.",
    points: ["Daily, weekly and monthly views", "Steps, distance, VO2 max and pace", "A weekly read on your progress"],
    screen: "analytics",
    composite: "c-analytics",
    tone: "aqua",
  },
] as const;

/** Reasons to download, kept to outcomes rather than features. */
export const whyVygor = {
  title: "Why choose Vygor?",
  lead: "Six tools in one app, all working from the same plan.",
  reasons: [
    {
      icon: "clock",
      title: "Stop running five apps",
      body: "A meal planner, a tracker, a workout app and a notes file that never talk to each other — replaced by one plan where each part knows what the others are doing.",
    },
    {
      icon: "sparkle",
      title: "No more guessing or calculating",
      body: "Vygor works out what to eat, what to train and what your numbers should be. You get a plan to follow instead of a spreadsheet to maintain.",
    },
    {
      icon: "heart",
      title: "A plan that bends, not breaks",
      body: "A bad week adjusts the plan rather than ending it. Vygor keeps recalibrating around your real life instead of resetting you to day one.",
    },
    {
      icon: "activity",
      title: "Everything in one timeline",
      body: "Weight, BMI, body fat, steps and meals in a single view, with Apple Health syncing automatically so nothing has to be entered twice.",
    },
  ],
} as const;

export const howItWorks = [
  {
    step: "01",
    title: "Tell Vygor about you",
    body: "Your goals, food preferences, fitness level and routine — the things a generic plan ignores.",
  },
  {
    step: "02",
    title: "Get your personalized plan",
    body: "Vygor builds your meals, workouts and daily targets around what you just told it.",
  },
  {
    step: "03",
    title: "Make progress every day",
    body: "Log, review, adjust. The plan keeps moving with you instead of resetting when a week goes badly.",
  },
] as const;

/**
 * The day-to-day journey, shown as a row of screens rather than a switcher.
 * Ordered as a real day, with training placed where it actually happens rather
 * than bolted on the end.
 */
export const showcase = [
  {
    id: "today",
    step: "Every morning",
    title: "See where you stand",
    body: "Weight, goal, BMI, body fat and steps in one snapshot.",
    screen: "home",
  },
  {
    id: "recipe",
    step: "At mealtimes",
    title: "Know what to cook",
    body: "Time, calories, dietary tags and the full macro split up front.",
    screen: "recipe-detail",
  },
  {
    id: "videos",
    step: "When you'd rather watch",
    title: "Follow along",
    body: "A video library sitting right next to the recipes.",
    screen: "recipe-videos",
  },
  {
    id: "log",
    step: "After you eat",
    title: "Log it in seconds",
    body: "Macros broken down, ingredients editable if a photo read slightly off.",
    screen: "coach",
  },
  {
    id: "train",
    step: "When you train",
    title: "Just follow the session",
    body: "Warm-up, main set and cool-down, with the reps already decided.",
    screen: "exercise-plan",
  },
] as const;

/** The differentiation section — reached from the "Why AI" nav link. */
export const personalization = {
  kicker: "Why AI?",
  title: "Hyper-personalization — built around you, not the average person.",
  lead:
    "Two people with the same goal rarely need the same plan. AI is how Vygor reads your goals, food, activity and progress together, then reshapes the plan as any one of them changes. A human plan gets written once; this one gets rewritten every week.",
  facets: [
    { label: "Your goal", detail: "Lose, maintain or build — with a target you set yourself." },
    { label: "Your food", detail: "Preferences and cuisines you'll genuinely eat." },
    { label: "Your activity", detail: "Fitness level, equipment and how the week is going." },
    { label: "Your routine", detail: "Meals and sessions that fit the time you have." },
    { label: "Your progress", detail: "Weight, BMI and body-fat trends feed back into the plan." },
    { label: "Your pace", detail: "A slow week adjusts the plan — it doesn't end it." },
  ],
};

export const emotional = {
  title: "Healthy shouldn't feel like another full-time job.",
  body:
    "Less calculating. Less guessing. Less starting over every Monday. Just a system that keeps up with you and quietly makes the next good decision the easy one.",
};

export const oneApp = {
  title: "Less juggling. More progress.",
  lead:
    "A meal planner here, a tracker there, a workout app you stopped opening. Vygor connects all of it, so each part knows what the others are doing.",
  nodes: [
    "Meal plans",
    "Recipes",
    "Macro tracking",
    "Workouts",
    "Progress",
    "Weekly insights",
    "Contests",
    "Apple Health",
  ],
};

/**
 * Pricing comparison.
 *
 * Each row names a real, well-known app for that job and its published annual
 * price, so the total is checkable rather than rhetorical. Prices were looked
 * up in August 2026 for the US, standard individual annual plans — they move
 * with promotions and region, which the section says plainly.
 */
export const pricing = {
  kicker: "Pricing",
  title: "One subscription instead of five.",
  lead:
    "Vygor covers what these apps cover separately. Here is what each of them charges for a year, at list price.",
  rows: [
    { job: "Meal plans", app: "Noom", annual: 209.0, note: "annual plan" },
    { job: "Recipes", app: "NYT Cooking", annual: 39.99, note: "annual plan" },
    { job: "Exercise plans", app: "Boostcamp Pro", annual: 59.99, note: "annual plan" },
    { job: "Macro tracking", app: "MyFitnessPal Premium", annual: 79.99, note: "annual plan" },
    { job: "Meditation", app: "Headspace", annual: 69.99, note: "annual plan" },
  ],
  plan: {
    name: "Vygor Premium",
    price: "$79.99",
    period: "per year",
    blurb: "One plan. Everything included. No tiers to compare.",
    includes: [
      "AI Dietitian and meal plans",
      "AI Recipes, with videos",
      "AI Macro Tracker",
      "AI Trainer",
      "Contests",
      "Analytics",
    ],
    cta: "Get Vygor",
  },
  disclaimer:
    "Competitor prices are list prices for a standard individual annual plan in the US, checked in August 2026, and are shown for comparison only — they change with promotions and region. Vygor is free to download and the basic version is free to use for as long as you like; Premium is $79.99 per year on the App Store.",
};

/**
 * Support. One address, no form — see Contact.tsx for why.
 *
 * The prompts spell out what is worth writing in about: a bare "contact us"
 * tends to attract only complaints, and feature requests never arrive.
 */
export const contact = {
  kicker: "Support",
  title: "Feedback, ideas, or something not working?",
  lead:
    "Tell us what would make Vygor better, what you would like it to do next, or anything that is not behaving. A real person reads every message.",
  prompts: ["Feedback", "Feature requests", "Something's broken", "Anything else"],
  footnote: "We read everything that comes in.",
};

export const faqs = [
  {
    q: "What is Vygor?",
    a: "Vygor is a super app for weight management and wellness, with human-driven AI tools for meal planning, exercise plans, recipes and macro tracking. Instead of running several apps that don't talk to each other, you get one plan that adapts as your goals and routine change.",
  },
  {
    q: "How does Vygor personalize my plan?",
    a: "You start by telling Vygor about your goals, food preferences, fitness level and routine. It builds your meals, workouts and daily targets from that, then adjusts automatically as your weight, activity and preferences change over time.",
  },
  {
    q: "Can Vygor create meal plans?",
    a: "Yes. The AI Dietitian generates meal plans for your goals rather than handing you a fixed template, laid out day by day with calories, carbs, protein and fat for each meal.",
  },
  {
    q: "Can Vygor generate recipes?",
    a: "Yes. AI Recipes generates recipes around your macros and taste preferences, each with ingredients, step-by-step instructions and a nutrition breakdown. There is also a video library in the app if you would rather watch a recipe being made.",
  },
  {
    q: "Can Vygor create workouts?",
    a: "Yes. The AI Trainer builds routines around your fitness level and goals, including a warm-up, main workout and cool-down, along with the equipment needed. The routine changes from session to session as you progress.",
  },
  {
    q: "Can I track calories and macros?",
    a: "Yes. You can log a meal by photo, barcode scan, gallery image or by typing it in, and Vygor returns the calorie, carb, protein and fat breakdown and syncs it to your daily plan.",
  },
  {
    q: "What are contests?",
    a: "Contests let you set a weight goal alongside friends or family over a fixed period, with a shared start date, a target and a countdown. Social support is one of the more reliable ways to keep a new habit going, so it is built into the app rather than bolted on.",
  },
  {
    q: "Is Vygor suitable for beginners?",
    a: "Yes. Vygor is designed so you don't need to know how to build a meal plan or a training programme — you answer questions about yourself and it does the planning. The plan starts where your fitness level actually is.",
  },
  {
    q: "Is my data private?",
    a: "Vygor states that it never sells your profile information to anyone. According to its App Store privacy disclosure, the data it collects — including contact info, photos and device identifiers — is not linked to your identity. The full privacy policy has the complete detail.",
  },
  {
    q: "Which devices does Vygor support?",
    a: "Vygor runs on iPhone, and also supports Apple Watch and Apple Vision. It syncs with Apple Health automatically so your progress stays in one place. An Android version is not available yet.",
  },
  {
    q: "How much does Vygor cost?",
    a: "Vygor is free to download and the basic version is free to use for as long as you like. Upgrading is a single subscription — Premium at $79.99 per year — with no tiers to compare and nothing held back. Prices shown on the App Store are the definitive ones and may vary by region.",
  },
] as const;

export const downloadCta = {
  title: "Ready to make your next healthy choice easier?",
  body: "Start building a healthier routine with Vygor.",
  footnote: "Free to download.",
  /** Small tiles that fill the panel and recap what comes in the box. */
  included: [
    { name: "AI Dietitian", detail: "Meal plans built for your goals" },
    { name: "AI Recipes", detail: "Generated recipes, plus videos" },
    { name: "AI Macro Tracker", detail: "Log a meal from a photo" },
    { name: "AI Trainer", detail: "Workouts that adapt as you go" },
    { name: "Contests", detail: "Progress with friends and family" },
    { name: "Analytics", detail: "See what is actually working" },
  ],
};

/** Shown in the footer — the app carries the same caveat on AI-generated content. */
export const disclaimer =
  "Vygor is a wellness app and does not provide medical advice, diagnosis or treatment. Meal plans, recipes and workouts are AI-generated general guidance — check ingredients against your own allergies and dietary needs, and talk to a qualified healthcare professional before making significant changes to your diet or exercise routine.";

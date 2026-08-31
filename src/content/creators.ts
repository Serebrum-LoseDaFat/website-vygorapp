/**
 * Content for the creator programme page at /creators.
 *
 * Audience note: this page is NOT for the consumer the homepage is written for.
 * It is read by influencers and partners deciding whether to work with Vygor and
 * what they are allowed to say. That is why it lives on its own route rather
 * than as a homepage section — dropping two thousand words of compliance rules
 * and segment playbooks into a conversion page would bury the download.
 *
 * PRODUCT FACTS: prices, platform support and what each tool does must stay in
 * step with `modules` and `pricing` in site.ts. If a fact changes there, change
 * it here too.
 *
 * CLAIMS: everything below either describes the product or states a rule the
 * team has set. Nothing here asserts an outcome, and the prohibited list exists
 * precisely to stop creators from asserting one.
 */

export const creatorsIntro = {
  kicker: "Creator programme",
  title: "Create with Vygor.",
  lead:
    "Everything you need to make honest, effective content about Vygor — how the product works, what makes short-form land, the rules every post has to follow, and angles written for your niche.",
};

/**
 * What a creator is actually promoting. Deliberately short: the full product
 * story is on the homepage, and this page links there rather than restating it.
 */
export const creatorProduct = {
  title: "Know what you are promoting.",
  lead:
    "Vygor is a weight management super app — six AI tools in one subscription, all working from the same plan. Free to download, with Premium at $79.99 a year. iPhone only today.",
  tools: [
    [
      "AI Dietitian",
      "Personalised meal plans for the member's goals, with calories and macros per meal. Adapts as weight and preferences change.",
    ],
    [
      "AI Recipes",
      "Recipes generated around their macros and taste, with ingredients, nutrition and a built-in video library.",
    ],
    [
      "AI Macro Tracker",
      "Log a meal from a photo, barcode or text. Vygor works out the calories, carbs, protein and fat.",
    ],
    [
      "AI Trainer",
      "Workouts built around fitness level and available equipment, progressing session to session.",
    ],
    [
      "Contests",
      "Weight or step competitions with friends, family or followers — a shared target and a countdown.",
    ],
    [
      "Analytics",
      "Weight, BMI and body-fat trends over days, weeks and months, with a weekly read-back of the numbers.",
    ],
  ],
} as const;

/** Craft guidance. Applies to every segment and every platform. */
export const creatorPractices = [
  {
    title: "Hook in the first two seconds",
    body:
      "Open on a bold statement, a question, a problem, a surprising result or a strong visual. Nothing you say after second three matters if the first two did not land.",
  },
  {
    title: "One idea per video",
    body:
      "Build each video around a single audience problem, a single benefit and a single action. Two ideas in one video usually means neither is remembered.",
  },
  {
    title: "Show, do not tell",
    body:
      "Get the app on screen early and let people watch it being used. Watching the macro tracker read a photo beats any sentence describing it.",
  },
  {
    title: "Keep it native",
    body:
      "Your own voice, vertical framing, natural delivery, captions, quick pacing. Corporate polish reads as an advert and gets scrolled past.",
  },
  {
    title: "End with one clear action",
    body:
      "Say exactly what to do next — download, try it, tap the link. An implied call to action is a missed one.",
  },
  {
    title: "Thirty to sixty seconds",
    body:
      "That suits most content. A pure hook video can run fifteen to twenty seconds; a walkthrough can reach ninety if every second earns its place.",
  },
  {
    title: "Two to four posts a week",
    body:
      "Spaced at least a day apart. A steady cadence outperforms a burst followed by silence — consistency compounds.",
  },
  {
    title: "Sound like yourself",
    body:
      "Vygor is practical, optimistic and honest, not hype-driven or clinical. Speak from your own experience, skip the superlatives, and never promise a result you cannot stand behind.",
  },
] as const;

/**
 * Non-negotiable. Placed before the segment playbooks on purpose: a creator who
 * reads only the angles for their own niche has still passed these rules first.
 */
export const creatorCompliance = {
  title: "Compliance applies to every post.",
  lead:
    "Vygor is a wellness app, not a medical product and not a medical device. It does not diagnose, treat or manage any condition, and no post may suggest otherwise.",
  approval:
    "Every post is reviewed before it goes live. Send your draft caption, your video or script, and your promo code, and expect a reply within two working days.",
  required: [
    "#ad, #sponsored, or a paid partnership label on every post",
    "Written approval on the content and the caption before publishing",
    "Your own promo code and tracking link in every post",
    "An honest, first-person account of using the app",
  ],
  prohibited: [
    "Specific weight loss claims, such as a number of pounds or a dress size",
    "Medical claims of any kind, such as treating PCOS or balancing hormones",
    "Before-and-after body transformation imagery",
    "The words cure, reverse or heal, and any claim of clinical proof",
    "Using another creator's promo code or tracking link",
  ],
} as const;

/**
 * Per-niche playbooks: the angle, hooks with a chance of working, formats that
 * suit the niche, and the do and do-not pair specific to it. These sit on top
 * of the global compliance rules and never override them.
 */
export const creatorSegments = [
  {
    id: "weight-loss",
    name: "Weight loss",
    summary:
      "Vygor is the whole system rather than one more tracker: a dietitian that builds the plan, a tracker that logs a meal from a photo, workouts, and contests that keep people going past the point most give up.",
    hooks: [
      "I stopped counting calories and did this instead.",
      "I have lost and regained the same ten pounds for years. Here is what finally changed.",
      "Thirty days in — here is what the data actually showed me.",
      "I challenged my friends to a weight contest. This is how it went.",
    ],
    formats: [
      "Habit-versus-habit comparison, never body imagery",
      "A week of check-ins",
      "A thirty, sixty or ninety day reflection",
      "A follower contest and its result",
    ],
    dos: [
      "Talk about habits and consistency",
      "Share your own experience of the app",
      "Show the contest feature",
    ],
    donts: [
      "Promise a number of pounds or a guaranteed result",
      "Post before-and-after body photos",
      "Say Vygor makes you lose weight — it is tools plus consistency",
    ],
  },
  {
    id: "nutrition",
    name: "Diet and nutrition",
    summary:
      "The strongest angle for nutrition creators: a dietitian that generates a plan with macros per meal, recipes built around taste and targets, and a tracker that reads a photo, a barcode or a line of text.",
    hooks: [
      "An AI built my meal plan around my actual goals. Here is what it gave me.",
      "I photographed my lunch and it got the macros right.",
      "One app replaced my food log and my meal-planning spreadsheet.",
      "I asked for a week of recipes that hit my macros. This is what I ate.",
    ],
    formats: [
      "Walkthrough of a plan being generated",
      "Photo-log demo with the macros appearing",
      "A week of eating powered by AI Recipes",
      "What a plan like this would otherwise cost",
    ],
    dos: [
      "Show the Dietitian and Recipes working",
      "Demonstrate photo and barcode logging",
      "Frame it as nutrition and habits together",
    ],
    donts: [
      "Position it as a replacement for a registered dietitian",
      "Say it fixes disordered eating",
      "Make condition-specific claims such as insulin resistance",
    ],
  },
  {
    id: "womens-health",
    name: "Women's health",
    summary:
      "Managing weight through PCOS, perimenopause or the postpartum period takes more than willpower. Vygor offers plans that adapt, macro tracking, workouts, and trends you can actually read.",
    hooks: [
      "Managing my weight with PCOS is nothing like just eat less.",
      "I gained weight in perimenopause. These are the habits that helped.",
      "Staying consistent is harder when your hormones are not cooperating.",
      "The one app that does not assume my body works like everyone else's.",
    ],
    formats: [
      "A personal story of your own journey",
      "What I wish I had known",
      "A day in the life, with the check-in as self-care",
      "A community question on staying consistent",
    ],
    dos: [
      "Centre habit consistency",
      "Speak from personal experience",
      "Frame it as a support tool alongside medical care",
      "Acknowledge that every body is different",
    ],
    donts: [
      "Say Vygor treats PCOS, menopause or anything else",
      "Claim it balances hormones or eases symptoms",
      "Use the words cure, reverse or heal",
    ],
  },
  {
    id: "fitness",
    name: "Fitness and training",
    summary:
      "Both halves in one place: AI-built training and the nutrition to fuel it. Useful for showing an audience how the two fit together instead of living in four separate apps.",
    hooks: [
      "AI built my workout plan and my meal plan. I cancelled two subscriptions.",
      "Why people who train every day still struggle with their weight.",
      "I photographed my post-workout meal and the macros came back instantly.",
      "I set a step challenge for my followers. Here is what happened.",
    ],
    formats: [
      "A full day: workout in the morning, photo logs at meals",
      "Generating a week of workouts and meals together",
      "A thirty-day training and nutrition challenge",
      "A step or weight contest with your audience",
    ],
    dos: [
      "Show workouts progressing session to session",
      "Show the nutrition side fuelling the training",
      "Use contests for audience challenges",
    ],
    donts: [
      "Claim it accelerates muscle gain or performance",
      "Make body composition claims",
      "Suggest it substitutes for a personal trainer",
    ],
  },
  {
    id: "wellness",
    name: "Wellness and lifestyle",
    summary:
      "Fits a healthy-life framing rather than a diet one: plans, recipes, training, tracking and trends that bend with real life instead of resetting when a week goes badly.",
    hooks: [
      "The one app that changed how I think about my health habits.",
      "I have tried every wellness routine. This is the only one that stuck.",
      "My soft approach to weight management — no restriction, just habits.",
      "I started a challenge with my community and the result surprised me.",
    ],
    formats: [
      "A morning routine with the check-in in it",
      "Apps that are genuinely part of my routine",
      "What thirty days of tracking taught me",
      "A community step or weight contest",
    ],
    dos: [
      "Talk about consistency and showing up for yourself",
      "Treat weight as one part of overall wellbeing",
      "Show it honestly inside your real routine",
    ],
    donts: [
      "Lean on diet culture, restriction or body pressure",
      "Claim specific outcomes",
      "Present it as a quick fix",
    ],
  },
  {
    id: "coaches",
    name: "Wellness coaches",
    summary:
      "A client-side tool that gets used between sessions — plans, tracking and programming, with sharing for visibility on progress, and contests for running group challenges across a roster.",
    hooks: [
      "I wanted an app that lets me see how clients are doing between sessions.",
      "I run accountability groups. Here is how I use Vygor for them.",
      "I set up a thirty-day contest for my coaching group.",
      "My clients can challenge each other now, not just track themselves.",
    ],
    formats: [
      "How I follow client progress",
      "Setting up a contest between groups",
      "A week in my practice, with the app in the workflow",
      "An open challenge for your audience",
    ],
    dos: [
      "Show sharing as an accountability tool",
      "Demonstrate contests for group challenges",
      "Be clear it supports your coaching rather than replacing it",
    ],
    donts: [
      "Imply it provides coaching, therapy or clinical guidance",
      "Claim specific client outcomes",
      "Show client data or anything identifying",
    ],
  },
  {
    id: "clinical",
    name: "Medical and clinical",
    summary:
      "The gap between clinical advice and follow-through is behavioural. Vygor is a patient-side habit tool that complements care. It is not a medical device and it is not clinically validated.",
    hooks: [
      "Why patients struggle to stick to healthy habits.",
      "The gap between knowing what to do and doing it.",
      "Behaviour change is the strongest predictor of sustainable weight management.",
      "Willpower is not the problem.",
    ],
    formats: [
      "An explainer on habit formation",
      "Apps I actually mention to patients",
      "Why diets fail, and what behaviour tools do differently",
      "An honest review of what it does and does not do",
    ],
    dos: [
      "Frame it as a habit tool, not an intervention",
      "State plainly that it is a wellness app, not a medical device",
      "Present it as complementary to clinical care",
      "Disclose the partnership prominently — this audience expects it",
    ],
    donts: [
      "Say it treats or manages any condition",
      "Imply clinical validation or regulatory clearance",
      "Overstate what it does — this audience will notice",
    ],
  },
] as const;

/**
 * Submission and contact.
 *
 * The phone number and WhatsApp line from the internal brief are deliberately
 * omitted. Publishing a direct number on an indexable page invites automated
 * scraping, and it can be added later if the team decides it wants that. Email
 * is the reviewable, forwardable route and matches how the rest of the site
 * handles contact.
 */
export const creatorContact = {
  title: "Send a draft.",
  lead:
    "Share your draft caption, the video or script, and your promo code. You will hear back within two working days.",
  socials: "We are @vygorapp on Instagram and TikTok.",
} as const;

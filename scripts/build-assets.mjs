/**
 * Optimizes the source Vygor brand + product art into web-ready files.
 * Source art lives outside the app (one level up) so the originals stay
 * untouched. Run with: npm run assets
 *
 * WHY THE PRE-RENDERED MOCKUPS ARE NO LONGER USED
 * -----------------------------------------------
 * The supplied `-removebg-preview` mockups are 339px wide. They render at
 * ~330 CSS px, which needs 660 device px on a retina screen — so they carried
 * about half the pixels required and looked soft. Upscaling adds no detail.
 *
 * Instead the same "popped-out card" composition is rebuilt from the original
 * 1290x2796 screenshots: the device bezel is drawn in CSS (vector, sharp at
 * any size), the screen is a 1080px-wide export, and the popped-out card is a
 * separate high-resolution crop of the same screenshot. Everything is sharp
 * and the crops stay editable here.
 *
 * EACH HIGHLIGHT RECORDS ITS FULL BOX, NOT JUST ITS WIDTH
 * ------------------------------------------------------
 * The manifest stores the crop's left/top/width/height as fractions of the
 * screen. PhoneWithHighlight uses those to sit the card exactly over the region
 * it was cut from. That matters: an earlier version floated the card off to one
 * side, which left the original still visible underneath, so the same rings or
 * tabs appeared twice and read as a rendering fault rather than a design.
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir, writeFile, rm, readdir, unlink } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "assets");
const SHOTS = path.join(SRC, "screenshots");
const BRAND = path.join(SRC, "brand");
const OUT_APP = path.resolve(process.cwd(), "public/app");
const OUT_BRAND = path.resolve(process.cwd(), "public/brand");

/**
 * Sources whose pixels are stored upside down.
 *
 * IMG_9973 used to belong here: it was saved 180-degree rotated while its EXIF
 * orientation tag claimed "normal", so nothing downstream corrected it and the
 * home screen rendered inverted. The source file has since been re-saved
 * upright, which turned this entry into a double-correction that flipped the
 * export back over. Verified 2026-08: every file in assets/screenshots is now
 * correctly oriented, so the set is empty.
 *
 * Keep the mechanism. If a future capture arrives upside down, add it here and
 * it is corrected at ingest, so no component ever needs a compensating CSS
 * transform. Check the source with `sharp(file).metadata()` first — a wrong
 * entry here is invisible until someone reruns `npm run assets`.
 */
const ROTATE_180 = new Set([]);

/** Screen exports. 1080px covers a 360 CSS px phone at 3x. */
const SCREENS = [
  ["IMG_9973.PNG", "home"], // shows a real Body Fat figure, not "connect to add"
  ["IMG_9932.PNG", "meal-plan"],
  ["IMG_9938.PNG", "recipes"],
  ["IMG_9939.PNG", "recipe-detail"],
  ["IMG_9943.PNG", "recipe-videos"],
  ["IMG_9945.PNG", "macro-tracker"],
  ["IMG_9949.PNG", "coach"],
  ["IMG_9954.PNG", "exercise-plan"],
  ["IMG_9957.PNG", "contests"],
  ["IMG_9961.PNG", "analytics"],
  // The "How it works" cluster. Slugged "meal-calendar" rather than
  // "meal-plans" so it cannot be confused with the existing "meal-plan".
  ["IMG_9972.PNG", "goals"],
  ["IMG_9960.PNG", "progress"],
  ["IMG_9948.PNG", "tracker"],
  ["IMG_9952.PNG", "meal-calendar"],
  // Creator page product cards. Supplied already composed so the part that
  // explains each tool sits at the top of the screen, which lets these cards
  // use the same framing as every other card instead of a per-card offset.
  ["creator-dietitian.png", "creator-dietitian"],
  ["creator-contests.png", "creator-contests"],
  ["creator-analytics.png", "creator-analytics"],
];

/**
 * Hand-composed product shots for the features section: each is a complete
 * phone mockup with a pop-out card already laid out over it, supplied as a
 * finished 1290x2796 PNG on a pure-white ground.
 *
 * These replace the old approach of cropping a region out of a screenshot and
 * floating it back over the same screenshot in the DOM, which could never be
 * more than approximately aligned. The composition is now settled in the source
 * artwork, so there is nothing here to align.
 *
 * WHY THE CROPS ARE HAND-MEASURED
 * ------------------------------
 * The phone is the same size in all six files (dark bezel measures 2225px tall
 * in every one), but it sits at slightly different x/y positions because each
 * pop-out pushes it around the canvas. Cropping every file to one 1274x2264
 * window *registered on the bezel* means the device lands in exactly the same
 * place in all six, so switching tabs never makes it jump. `extend` pads with
 * white first where a window would fall outside the source.
 *
 * The white ground is kept rather than keyed out: the features section sits on
 * pure white, so it blends invisibly, and keeping it avoids the halos that alpha
 * extraction leaves around the soft drop shadows.
 */
const COMPOSITES = [
  // [source, slug, whitePadding, cropWindow]
  ["Split 3.png", "c-dietitian", { right: 16 }, { left: 32, top: 481 }],
  ["Split 5.png", "c-recipes", { right: 16 }, { left: 32, top: 481 }],
  ["Split 4.png", "c-macros", { right: 16 }, { left: 32, top: 481 }],
  ["Split 1.png", "c-trainer", {}, { left: 10, top: 496 }],
  ["Split 6.png", "c-contests", { right: 16 }, { left: 32, top: 481 }],
  ["Split 2.png", "c-analytics", { left: 13 }, { left: 0, top: 481 }],
];

/** Every composite is cropped to this one window, registered on the bezel. */
const COMPOSITE_SIZE = { width: 1274, height: 2264 };

/**
 * Regions painted out of a screen before export, filled with the flat colour
 * sampled just below them. Used to drop the in-app date strips: they show 2026
 * dates that read as stale on a marketing page, and they add noise directly
 * under the header where the eye lands first.
 */
const SCREEN_MASKS = {
  "meal-plan": [{ left: 0, top: 358, width: 1290, height: 392, sampleAt: { x: 645, y: 800 } }],
};

await mkdir(OUT_APP, { recursive: true });
await mkdir(OUT_BRAND, { recursive: true });

const screens = {};
let total = 0;

/**
 * Every generated file carries a short hash of its own bytes.
 *
 * Without it, re-cropping an asset kept the same filename, so the year-long
 * immutable cache on /app/* (and Next's own image cache) went on serving the
 * previous version — a card would render at the old crop's aspect ratio and no
 * amount of rebuilding fixed it. Hashing the name means new bytes are a new URL
 * and the long cache lifetime becomes safe rather than dangerous.
 */
function hashOf(buffer) {
  return createHash("sha256").update(buffer).digest("base64url").slice(0, 8);
}

/** Writes `<slug>.<hash>.webp` and returns its public path + dimensions. */
async function writeHashed(pipeline, slug, dir = OUT_APP, ext = "webp") {
  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  const name = `${slug}.${hashOf(data)}.${ext}`;
  await writeFile(path.join(dir, name), data);
  total += data.length;
  return { src: `/${path.basename(dir)}/${name}`, width: info.width, height: info.height };
}

// Old hashed builds would otherwise pile up in public/.
for (const dir of [OUT_APP, OUT_BRAND]) {
  for (const f of await readdir(dir).catch(() => [])) {
    await unlink(path.join(dir, f)).catch(() => {});
  }
}


/**
 * The contest card carries a real participant's profile photo. It is replaced
 * with a drawn round avatar rather than blurred: a blur still reads as "someone
 * censored a face", whereas a clean generic avatar reads as product UI. The
 * circle is drawn at the exact size of the original so nothing shifts.
 */
const AVATAR_SWAP = {
  // Keyed by source file, not by slug: IMG_9957 feeds both the full contest
  // screen (shown whole in the hero) and the h-contest crop, and the face has
  // to be gone from both.
  "IMG_9957.PNG": { left: 958, top: 1609, width: 116, height: 116, initial: "K" },
};

/** A round avatar: soft brand-tinted disc with a single initial. */
function avatarSvg(size, initial) {
  const r = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0" stop-color="#BFE6FA"/>
           <stop offset="1" stop-color="#8FD3C7"/>
         </linearGradient>
       </defs>
       <circle cx="${r}" cy="${r}" r="${r - 3}" fill="url(#g)" stroke="#FFFFFF" stroke-width="6"/>
       <text x="50%" y="50%" dy="0.35em" text-anchor="middle"
             font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(size * 0.46)}"
             font-weight="700" fill="#0A3B4C">${initial}</text>
     </svg>`,
  );
}

/**
 * Brings a source screenshot to a correct, publishable state before anything
 * else reads it: fixes stored rotation, and replaces the one real participant
 * photo with a drawn avatar. Returns a path when nothing changed so sharp can
 * stream from disk.
 */
async function normalize(file) {
  const base = path.basename(file);
  const swap = AVATAR_SWAP[base];
  const rotate = ROTATE_180.has(base);
  if (!swap && !rotate) return file;

  let pipeline = sharp(file);
  if (rotate) pipeline = sharp(await pipeline.rotate(180).toBuffer());
  if (swap) {
    const patch = await sharp(avatarSvg(swap.width, swap.initial)).png().toBuffer();
    pipeline = sharp(
      await pipeline.composite([{ input: patch, left: swap.left, top: swap.top }]).toBuffer(),
    );
  }
  return await pipeline.toBuffer();
}

async function maskedBuffer(input, slug) {
  const masks = SCREEN_MASKS[slug];
  if (!masks) return input;

  let buf = await sharp(input).toBuffer();
  for (const m of masks) {
    // Sample the page colour just outside the masked band so the fill is
    // indistinguishable from the app's own background.
    const { data } = await sharp(buf)
      .extract({ left: m.sampleAt.x, top: m.sampleAt.y, width: 4, height: 4 })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const fill = { r: data[0], g: data[1], b: data[2], alpha: 1 };
    const patch = await sharp({
      create: { width: m.width, height: m.height, channels: 4, background: fill },
    })
      .png()
      .toBuffer();
    buf = await sharp(buf).composite([{ input: patch, left: m.left, top: m.top }]).toBuffer();
  }
  console.log(`${slug.padEnd(16)} masked ${masks.length} region(s)`);
  return buf;
}

for (const [file, slug] of SCREENS) {
  const input = await maskedBuffer(await normalize(path.join(SHOTS, file)), slug);
  for (const w of [1080, 540]) {
    const asset = await writeHashed(
      sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: 86, effort: 6 }),
      w === 1080 ? slug : `${slug}@${w}`,
    );
    if (w === 1080) screens[slug] = asset;
  }
  console.log(`${slug.padEnd(16)} screen -> 1080w + 540w`);
}

// --- hand-composed product shots -------------------------------------------
const composites = {};
for (const [file, slug, pad, crop] of COMPOSITES) {
  const source = path.join(SRC, "composites", file);
  const padded = Object.keys(pad).length
    ? await sharp(source)
        .extend({ top: 0, bottom: 0, left: 0, right: 0, ...pad, background: "#ffffff" })
        .toBuffer()
    : source;

  for (const w of [COMPOSITE_SIZE.width, 640]) {
    const asset = await writeHashed(
      sharp(padded)
        .extract({ ...crop, ...COMPOSITE_SIZE })
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 88, effort: 6 }),
      w === COMPOSITE_SIZE.width ? slug : `${slug}@640`,
    );
    if (w === COMPOSITE_SIZE.width) composites[slug] = asset;
  }
  console.log(`${slug.padEnd(16)} composite from ${file}`);
}

// --- brand -----------------------------------------------------------------

const logo = sharp(path.join(BRAND, "logo.png")).trim();
const { info: logoInfo } = await logo.clone().toBuffer({ resolveWithObject: true });
const logoAsset = await writeHashed(
  logo.clone().resize({ width: 320, withoutEnlargement: true }).png({ compressionLevel: 9 }),
  "vygor-logo",
  OUT_BRAND,
  "png",
);
console.log(`logo trimmed to ${logoInfo.width}x${logoInfo.height}`);

const iconAsset = await writeHashed(
  sharp(path.join(BRAND, "logo.png"))
    .trim()
    .resize({ width: 180, height: 180, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png(),
  "icon-180",
  OUT_BRAND,
  "png",
);

const markAsset = await writeHashed(
  sharp(path.join(BRAND, "image__6_-removebg-preview.png")).webp({ quality: 92 }),
  "leaf-mark",
  OUT_BRAND,
);

// Official Apple "Download on the App Store" badge artwork, as supplied.
const badgeAsset = await writeHashed(
  sharp(path.join(BRAND, "image__8_-removebg-preview.png")).png({ compressionLevel: 9 }),
  "app-store-badge",
  OUT_BRAND,
  "png",
);
console.log(`app store badge ${badgeAsset.width}x${badgeAsset.height}`);

await writeFile(
  path.join(process.cwd(), "src/content/screens.generated.json"),
  JSON.stringify(
    {
      logo: logoAsset,
      icon: iconAsset,
      leafMark: markAsset,
      appStoreBadge: badgeAsset,
      screens,
      composites,
    },
    null,
    2,
  ) + "\n",
);

// Filenames are content-hashed, so a stale variant can never be served — but
// old entries would otherwise accumulate in Next's on-disk image cache.
await rm(path.resolve(process.cwd(), ".next/cache/images"), { recursive: true, force: true });

console.log(
  `
${Object.keys(screens).length} screens + ${Object.keys(composites).length} composites, ${(total / 1024).toFixed(0)} KB total.`,
);

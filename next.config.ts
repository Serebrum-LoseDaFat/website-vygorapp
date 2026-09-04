import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Apple Ads guide is read from disk at request time by /apple-ads. It is
  // not imported by any module, so tracing cannot infer it and the file would be
  // missing from the deployed function.
  outputFileTracingIncludes: {
    "/apple-ads": ["./src/content/apple-ads-guide.html"],
  },
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    // The source art is at most 640px wide (phone screens render ~320 CSS px,
    // the logo ~160). Trimming the default ladders stops Next from requesting
    // 1920/2048/3840 variants it would only ever upscale-cap back down.
    deviceSizes: [320, 384, 640, 750, 828, 1080],
    imageSizes: [64, 96, 128, 192, 256, 320],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        // Fingerprint-free static art: safe to cache hard, it is versioned by deploy.
        source: "/:dir(app|brand)/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;

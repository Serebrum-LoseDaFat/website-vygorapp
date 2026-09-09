import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
import { tools } from "@/content/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  // The enterprise content still lives on the existing vygor.health site and is
  // linked out to rather than duplicated here. Everything else of ours is
  // listed: /creators, because creators looking for the programme should find
  // it in search rather than only through the nav, and the free tools, which
  // exist to be found in search and are the main organic entry point.
  //
  // /apple-ads is deliberately absent — it is behind a sign-in, and listing a
  // private path in a public file only advertises it.
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tools`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    // Higher than the directory that lists them: the tool is the page people
    // search for and link to, the index is navigation.
    ...tools.map((tool) => ({
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${siteUrl}/creators`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}

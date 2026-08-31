import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  // Two routes. The enterprise content still lives on the existing vygor.health
  // site and is linked out to rather than duplicated here; /creators is ours,
  // and is listed because creators looking for the programme should be able to
  // find it in search rather than only through the nav.
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/creators`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}

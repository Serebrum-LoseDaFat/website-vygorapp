import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page site: the enterprise content lives on the existing vygor.health
  // site and is linked out to, not duplicated here.
  return [{ url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}

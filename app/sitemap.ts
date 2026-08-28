import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.launchIndexing) return [];
  return ["", "/questions", "/topics", "/sources", "/about", "/privacy"].map((path) => ({ url: `${siteConfig.url}${path}`, changeFrequency: "monthly" as const }));
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.launchIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/*?*"] }, sitemap: `${siteConfig.url}/sitemap.xml` };
}

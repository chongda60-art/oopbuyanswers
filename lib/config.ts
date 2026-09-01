import { contentConfig } from "@/lib/content";

const launchIndexingEnv = process.env.NEXT_PUBLIC_LAUNCH_INDEXING;

export const siteConfig = {
  brand: process.env.NEXT_PUBLIC_SITE_BRAND || contentConfig.brand,
  targetAgent: process.env.NEXT_PUBLIC_TARGET_AGENT || contentConfig.targetAgent,
  domain: contentConfig.domain,
  url: process.env.NEXT_PUBLIC_SITE_URL || `https://${contentConfig.domain}`,
  launchIndexing: launchIndexingEnv ? launchIndexingEnv === "true" : Boolean(contentConfig.launchIndexing),
  description: contentConfig.description,
  utm: {
    source: "oopbuyanswers",
    medium: "referral",
    campaign: "oopbuy_questions",
  },
} as const;

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

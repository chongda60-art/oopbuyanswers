export const siteConfig = {
  brand: process.env.NEXT_PUBLIC_SITE_BRAND || "Oopbuy Answers",
  targetAgent: "Oopbuy",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://oopbuyanswers.com",
  launchIndexing: process.env.NEXT_PUBLIC_LAUNCH_INDEXING === "true",
  description:
    "A focused research site for approved answers to Oopbuy questions, with clear evidence roles and review status.",
} as const;

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

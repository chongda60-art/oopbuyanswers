import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { publicQuestions, publicTopics } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.launchIndexing) return [];
  const staticPaths = ["/", "/questions", "/topics", "/sources", "/about", "/contact", "/privacy"];
  const questionPaths = publicQuestions.map((question) => `/questions/${question.slug}`);
  const topicPaths = publicTopics.map((topic) => `/topics/${topic}`);
  const uniquePaths = Array.from(new Set([...staticPaths, ...questionPaths, ...topicPaths]));

  return uniquePaths.map((path) => ({
    url: path === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${path}`,
    lastModified: new Date("2026-09-01"),
    changeFrequency: "monthly" as const,
  }));
}

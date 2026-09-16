import fs from "node:fs";
import playwright from "file:///E:/seo/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.js";

const { chromium } = playwright;
const base = "https://oopbuyanswers.com";
const target = "/questions/oopbuy-qc-finder";
const related = [
  "/questions/oopbuy-qc-photos",
  "/questions/oopbuy-spreadsheet-with-qc",
  "/questions/oopbuy-qc-photos-not-showing",
  "/questions/oopbuy-weidian-link",
  "/questions/oopbuy-shoe-size-chart",
];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const response = await page.goto(base + target, { waitUntil: "networkidle", timeout: 30000 });
const html = await page.content();
const hrefs = await page.locator('a[href*="www.curicart.com"]').evaluateAll((as) => as.map((a) => a.href));
const metrics = await page.evaluate(() => ({
  innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  bodyScrollWidth: document.body.scrollWidth,
  canonical: document.querySelector('link[rel="canonical"]')?.href || null,
  robots: document.querySelector('meta[name="robots"]')?.content || null,
  h1: document.querySelectorAll("h1").length,
}));
const relatedChecks = [];
for (const path of related) {
  const res = await fetch(base + path, { redirect: "manual" });
  relatedChecks.push({ path, status: res.status });
}
const result = {
  checked_at: new Date().toISOString(),
  target: { path: target, status: response?.status() ?? null, canonical: metrics.canonical, robots: metrics.robots, h1: metrics.h1 },
  mobile_390: { innerWidth: metrics.innerWidth, scrollWidth: metrics.scrollWidth, bodyScrollWidth: metrics.bodyScrollWidth, horizontal_overflow: metrics.scrollWidth > metrics.innerWidth || metrics.bodyScrollWidth > metrics.innerWidth },
  curicart_links: { count: hrefs.length, bad_utm: hrefs.filter((href) => !href.startsWith("https://www.curicart.com/") || !href.includes("utm_source=oopbuyanswers") || !href.includes("utm_medium=referral") || !href.includes("utm_campaign=oopbuy_questions") || href.includes("\\")).length },
  related: relatedChecks,
  title_present: html.includes("Oopbuy QC Finder: What It Can and Cannot Verify"),
  meta_present: html.includes("Use this Oopbuy QC finder guide to check item IDs"),
};
fs.mkdirSync("F:/seojieliu/reports/oopbuy-qc-finder-ctr-2026-09-16", { recursive: true });
fs.writeFileSync("F:/seojieliu/reports/oopbuy-qc-finder-ctr-2026-09-16/VERIFY_QC_FINDER.json", JSON.stringify(result, null, 2));
await page.screenshot({ path: "F:/seojieliu/reports/oopbuy-qc-finder-ctr-2026-09-16/qc-finder-mobile-390.png", fullPage: true });
if (result.target.status !== 200 || result.target.canonical !== base + target || result.target.robots !== "index, follow" || result.target.h1 !== 1 || result.mobile_390.horizontal_overflow || result.curicart_links.bad_utm !== 0 || !result.title_present || !result.meta_present || relatedChecks.some((item) => item.status !== 200)) process.exitCode = 1;
await browser.close();

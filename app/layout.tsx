import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import "./ui.css";
import { Header } from "@/components/Header";
import { contentConfig } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.brand} | ${siteConfig.targetAgent} question research`, template: `%s | ${siteConfig.brand}` },
  description: siteConfig.description,
  robots: { index: siteConfig.launchIndexing, follow: siteConfig.launchIndexing },
};

export const viewport: Viewport = {
  themeColor: "#fcfbf8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header /><div id="main">{children}</div><footer><div className="site-intro-card"><p><strong>{siteConfig.brand}</strong> is an independent guide site for Oopbuy research questions. We organize short answers about QC photos, product links, spreadsheets, sizing, shipping estimates, and related product examples. This site does not process orders, handle payments, manage shipping, or represent Oopbuy. Always check the live Oopbuy page and original source page before relying on item details, timing, or costs.</p></div><div className="footer-inner"><strong>{siteConfig.brand}</strong><p>{contentConfig.footerDisclosure}</p><nav aria-label="Footer"><a href="/sources">Sources</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></nav></div></footer></body></html>;
}

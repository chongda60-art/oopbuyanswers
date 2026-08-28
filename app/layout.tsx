import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.brand} | Oopbuy question research`, template: `%s | ${siteConfig.brand}` },
  description: siteConfig.description,
  robots: { index: siteConfig.launchIndexing, follow: siteConfig.launchIndexing },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header />{children}<footer><div className="footer-inner"><strong>{siteConfig.brand}</strong><p>Research pages separate community questions, search demand, official sources, public demonstrations, and CuriCart product data. No affiliation with Oopbuy is claimed.</p><nav aria-label="Footer"><a href="/sources">Sources</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></nav></div></footer></body></html>;
}

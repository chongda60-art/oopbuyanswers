import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Oopbuy question research",
  description: "Search approved Oopbuy answers by task. Questions stay private until their evidence and facts pass review.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const schema = { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.brand, url: siteConfig.url, description: siteConfig.description };
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><section className="hero"><h1>Oopbuy question research</h1><p>Search approved answers by task.</p><form className="search-shell" action="/questions" role="search"><label className="sr-only" htmlFor="home-search">Search Oopbuy questions</label><input id="home-search" name="q" placeholder="Search Oopbuy questions" autoComplete="off"/><button type="submit">Search</button></form></section><section className="empty-state" aria-labelledby="empty-title"><div className="empty-icon" aria-hidden="true">⌕</div><h2 id="empty-title">No approved questions are public yet.</h2><p>Topics will appear after approved questions are published.</p></section><section className="method-band"><h2>What this site will publish</h2><p>Only questions that pass content, fact, and SEO review. Community discussion can show demand, but current platform facts require a first-party source.</p><a href="/sources">Read the source method</a></section></main>;
}

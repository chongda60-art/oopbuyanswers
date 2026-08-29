import type { Metadata } from "next";
import { contentConfig } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Sources and evidence", description: `How ${siteConfig.brand} separates demand signals, demonstrations, first-party facts, and product data.`, alternates: { canonical: "/sources" } };

const roles = [
  ["Reddit", "Shows user questions, language, consensus, disagreement, and unusual cases. It does not verify current platform facts."],
  ["Google", "Shows search expressions and visible result types. Autocomplete is not monthly search volume."],
  ["YouTube", "Can show what a public video demonstrates at a specific time. It does not prove fees, policy, timing, or service quality."],
  [`${siteConfig.targetAgent} first-party sources`, `Required for current ${siteConfig.targetAgent} workflows, policies, limits, fees, and other platform facts.`],
  ["CuriCart", "May provide approved product images, category, SKU or style, size, reference price, source status, and canonical product links."],
] as const;

export default function SourcesPage() { return <main className="page reading"><header className="page-heading"><h1>Sources and evidence</h1><p>Each source type has a limited role. A source is never used to prove more than it can support.</p></header><div className="source-list">{roles.map(([name, detail]) => <section key={name}><h2>{name}</h2><p>{detail}</p></section>)}</div><section className="unknown-panel"><h2>What remains unknown</h2><p>{contentConfig.unknownsBody}</p></section></main>; }

import type { Metadata } from "next";
import { contentConfig } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Sources and references", description: `How ${siteConfig.brand} uses shopper questions, search terms, videos, live pages, and product examples.`, alternates: { canonical: "/sources" } };

const roles = [
  ["Reddit", "Helps identify the questions shoppers ask and the problems they describe."],
  ["Google", "Helps match the wording people use when they search for Oopbuy answers."],
  ["YouTube", "Can show public walkthroughs or examples when a video is closely related to the question."],
  [`${siteConfig.targetAgent} pages`, `Help readers check current screens, wording, and account-specific details.`],
  ["Product examples", "Help readers compare photos, category context, SKU or style details, sizes, and source-page clues."],
] as const;

export default function SourcesPage() { return <main className="page reading"><header className="page-heading"><h1>Sources and references</h1><p>Oopbuy pages, community discussions, search wording, videos, and product examples each help answer a different part of a shopper question.</p></header><div className="source-list">{roles.map(([name, detail]) => <section key={name}><h2>{name}</h2><p>{detail}</p></section>)}</div><section className="unknown-panel"><h2>What to recheck</h2><p>{contentConfig.unknownsBody}</p></section></main>; }

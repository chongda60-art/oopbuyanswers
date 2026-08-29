import type { Metadata } from "next";
import { contentConfig } from "@/lib/content";
export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };
export default function AboutPage() { return <main className="page reading"><header className="page-heading"><h1>{contentConfig.aboutTitle}</h1><p>{contentConfig.aboutBody}</p></header><h2>Publication standard</h2><p>A question must have a clear user task, auditable demand evidence, a useful direct answer, current sources for changing facts, and content, fact, and SEO approval. If the evidence cannot support a useful answer, the page stays private.</p></main>; }

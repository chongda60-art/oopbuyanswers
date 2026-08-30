import type { Metadata } from "next";
import { contentConfig } from "@/lib/content";
export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };
export default function AboutPage() { return <main className="page reading"><header className="page-heading"><h1>{contentConfig.aboutTitle}</h1><p>{contentConfig.aboutBody}</p></header><h2>What readers can use it for</h2><p>Use this site to compare Oopbuy questions, product-link checks, QC photo questions, spreadsheet issues, SKU or size details, and related product examples.</p></main>; }

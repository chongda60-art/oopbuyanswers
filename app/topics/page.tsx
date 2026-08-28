import type { Metadata } from "next";

export const metadata: Metadata = { title: "Topics", description: "Oopbuy research topics appear only when approved questions are published.", alternates: { canonical: "/topics" } };

export default function TopicsPage() { return <main className="page"><header className="page-heading"><h1>Topics</h1><p>Topic pages are created only when they contain approved, published questions.</p></header><section className="empty-state compact"><h2>No topics are public yet.</h2><p>QC, product links, spreadsheet, shipping, and SKU or size topics remain unpublished until their first answer passes review.</p></section></main>; }

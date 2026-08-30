import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact" } };
export default function ContactPage() { return <main className="page reading"><header className="page-heading"><h1>Contact</h1><p>Public submissions are not available in this first release.</p></header><p>This page does not collect or store messages.</p></main>; }

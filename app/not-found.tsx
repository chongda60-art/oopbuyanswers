import Link from "next/link";
export default function NotFound() { return <main className="page"><section className="empty"><h1>Product or page not found</h1><p>The record may be invalid, removed, or unavailable. Removed products are excluded from the sitemap.</p><Link href="/spreadsheet">Return to spreadsheet</Link></section></main>; }

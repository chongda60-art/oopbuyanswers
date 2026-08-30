import type { Metadata } from "next";
import Link from "next/link";
import { contentConfig, publicTopics } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Topics", description: `${siteConfig.targetAgent} research topics by question cluster.`, alternates: { canonical: "/topics" } };

export default function TopicsPage() {
  return (
    <main className="page">
      <header className="page-heading">
        <h1>Topics</h1>
        <p>Browse Oopbuy questions by QC photos, product links, spreadsheets, sizing, shipping, and related product checks.</p>
      </header>
      {publicTopics.length === 0 ? (
        <section className="empty-state compact">
          <h2>No topics are public yet.</h2>
          <p>{contentConfig.topicsEmptyBody}</p>
        </section>
      ) : (
        <section className="topic-pills topic-index" aria-label="Public topics">
          {publicTopics.map((topic) => <Link href={`/topics/${topic}`} key={topic}>{topic}</Link>)}
        </section>
      )}
    </main>
  );
}

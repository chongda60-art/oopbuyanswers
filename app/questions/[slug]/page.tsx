import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CuricartBridge } from "@/components/CuricartBridge";
import { allQuestions, getPublicQuestion, isIndexableQuestion, publicQuestions } from "@/lib/content";
import { siteConfig } from "@/lib/config";

function renderInlineLinks(text: string): ReactNode {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const parts: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    parts.push(
      <a href={match[2]} key={`inline-link-${key++}`} target="_blank" rel="noreferrer">
        {match[1]}
      </a>,
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length ? parts : text;
}

export function generateStaticParams() {
  return publicQuestions.map((question) => ({ slug: question.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const question = getPublicQuestion(slug);
    if (!question) return { title: "Question not found" };
    return {
      title: question.title,
      description: question.metaDescription || question.quickAnswer,
      alternates: { canonical: `/questions/${question.slug}` },
      robots: {
        index: siteConfig.launchIndexing && isIndexableQuestion(question),
        follow: siteConfig.launchIndexing,
      },
    };
  });
}

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = getPublicQuestion(slug);
  if (!question) notFound();

  const faqSchema = question.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: question.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Questions", item: `${siteConfig.url}/questions` },
      { "@type": "ListItem", position: 2, name: question.title, item: `${siteConfig.url}/questions/${question.slug}` },
    ],
  };

  const related = question.relatedQuestions
    .map((relatedSlug) => allQuestions.find((item) => item.slug === relatedSlug))
    .filter((item) => item && (item.status === "approved" || item.status === "published"));
  const bodySections = question.bodySections || [];

  return (
    <main className="page answer-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} /> : null}

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/questions">Questions</Link>
        <span aria-hidden="true">/</span>
        <span>{question.topic}</span>
      </nav>

      <header className="answer-hero">
        <p className="eyebrow">{question.targetKeyword}</p>
        <h1>{question.h1}</h1>
        <div className="quick-answer">
          <h2>Quick answer</h2>
          <p>{question.quickAnswer}</p>
        </div>
        {question.slug === "oopbuy-qc-finder" ? (
          <figure className="answer-visual" style={{ margin: "28px 0 0" }}>
            <Image
              src="/assets/qc-finder/qc-finder-workflow.webp"
              alt="QC finder workflow showing product image, source details, and option checks"
              width={1600}
              height={900}
              sizes="(max-width: 760px) 100vw, 850px"
              style={{ width: "100%", height: "auto", border: "1px solid var(--rule)", borderRadius: "16px" }}
              priority
            />
            <figcaption style={{ marginTop: "8px", color: "var(--muted)", fontSize: "14px" }}>Use the image, source record, option labels, and date as separate checks.</figcaption>
          </figure>
        ) : null}
      </header>

      {bodySections.length ? (
        bodySections.map((section) => (
          <section className={`answer-section${section.heading.toLowerCase().includes("check before relying") ? " unknown-box" : ""}`} key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{renderInlineLinks(paragraph)}</p>)}
            {section.ordered?.length ? <ol>{section.ordered.map((item) => <li key={item}>{item}</li>)}</ol> : null}
            {section.bullets?.length ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </section>
        ))
      ) : (
        <>
          <section className="answer-section">
            <h2>What this answer is based on</h2>
            <p>{question.evidenceSummary}</p>
          </section>

          <section className="answer-section">
            <h2>Steps</h2>
            <ol>{question.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          </section>

          <section className="answer-section">
            <h2>Mistakes to avoid</h2>
            <ul>{question.mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
          </section>

          <section className="answer-section unknown-box">
            <h2>What to check before relying on it</h2>
            <ul>{question.unknowns.map((unknown) => <li key={unknown}>{unknown}</li>)}</ul>
          </section>
        </>
      )}

      <CuricartBridge items={question.curicartBridge} contentSlug={question.slug} />

      {question.faq.length ? (
        <section className="answer-section">
          <h2>FAQ</h2>
          <div className="faq-list">
            {question.faq.map((item) => (
              <article key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="answer-section">
          <h2>Related questions</h2>
          <div className="related-links">
            {related.map((item) => item ? <Link href={`/questions/${item.slug}`} key={item.slug}>{item.title}</Link> : null)}
          </div>
        </section>
      ) : null}
    </main>
  );
}

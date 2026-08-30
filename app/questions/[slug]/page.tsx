import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CuricartBridge } from "@/components/CuricartBridge";
import { allQuestions, getPublicQuestion, publicQuestions } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export function generateStaticParams() {
  return publicQuestions.map((question) => ({ slug: question.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const question = getPublicQuestion(slug);
    if (!question) return { title: "Question not found" };
    return {
      title: question.title,
      description: question.quickAnswer,
      alternates: { canonical: `/questions/${question.slug}` },
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
      </header>

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

      <section className="answer-section source-block">
        <h2>References</h2>
        <ul>
          {question.sources.map((source) => (
            <li key={`${source.label}-${source.checkedAt}`}>
              <span>{source.label}</span>
              <p>{source.proves}</p>
            </li>
          ))}
        </ul>
      </section>

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

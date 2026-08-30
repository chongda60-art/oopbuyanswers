import type { Metadata } from "next";
import Link from "next/link";
import { CategoryNav } from "@/components/CategoryNav";
import { QuestionCard } from "@/components/QuestionCard";
import { contentConfig, publicQuestions, publicTopics } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: contentConfig.homeTitle,
  description: `Browse practical ${siteConfig.targetAgent} answers by task, topic, product link, QC photo, spreadsheet, and size question.`,
  alternates: { canonical: "/" },
};

export default function Home() {
  const schema = { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.brand, url: siteConfig.url, description: siteConfig.description };
  const featured = publicQuestions.slice(0, 10);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="hero-landing">
        <div className="hero-copy">
          <h1>{contentConfig.homeTitle}</h1>
          <p>{contentConfig.homeSubtitle}</p>
          <div className="hero-actions">
            <Link className="button-primary" href="/questions">Browse Oopbuy questions</Link>
            <Link className="button-secondary" href="#product-categories">Explore product categories</Link>
          </div>
        </div>
        <aside className="hero-question-panel" aria-labelledby="hero-question-panel">
          <h2 id="hero-question-panel">Top questions</h2>
          {publicQuestions.slice(0, 5).map((question) => (
            <Link href={`/questions/${question.slug}`} key={question.id}>{question.title}</Link>
          ))}
        </aside>
      </section>

      <CategoryNav />

      {featured.length > 0 ? (
        <section className="home-section" aria-labelledby="featured-questions">
          <div className="section-heading">
            <h2 id="featured-questions">Popular Oopbuy Questions</h2>
          </div>
          <div className="question-grid">
            {featured.map((question) => <QuestionCard question={question} key={question.id} />)}
          </div>
        </section>
      ) : (
        <section className="empty-state" aria-labelledby="empty-title">
          <div className="empty-icon" aria-hidden="true">⌕</div>
          <h2 id="empty-title">{contentConfig.emptyQuestionsTitle}</h2>
          <p>{contentConfig.emptyQuestionsBody}</p>
        </section>
      )}

      <section className="home-section how-use" aria-labelledby="how-use">
        <div className="section-heading">
          <h2 id="how-use">How to use these answers</h2>
        </div>
        <div className="how-use-grid">
          <article>
            <span>1</span>
            <h3>Read the quick answer</h3>
            <p>Start with the short answer before checking details.</p>
          </article>
          <article>
            <span>2</span>
            <h3>Check known limits</h3>
            <p>Separate what is known from what still needs checking.</p>
          </article>
          <article>
            <span>3</span>
            <h3>Compare related product examples</h3>
            <p>Use examples to compare links, photos, SKU, and size context.</p>
          </article>
        </div>
      </section>

      {publicTopics.length > 0 ? (
        <section className="home-section" aria-labelledby="category-entry">
          <div className="section-heading">
            <h2 id="category-entry">Oopbuy research topics</h2>
          </div>
          <div className="topic-pills">
            {publicTopics.map((topic) => <Link href={`/topics/${topic}`} key={topic}>{topic}</Link>)}
          </div>
        </section>
      ) : null}

      <section className="home-section" aria-labelledby="recent-questions">
        <div className="section-heading">
          <h2 id="recent-questions">Latest Oopbuy Questions</h2>
        </div>
        <div className="source-list compact-list">
          {publicQuestions.slice(0, 5).map((question) => (
            <section key={question.id}>
              <h2><Link href={`/questions/${question.slug}`}>{question.title}</Link></h2>
              <p>{question.searchIntent}</p>
            </section>
          ))}
        </div>
      </section>

    </main>
  );
}

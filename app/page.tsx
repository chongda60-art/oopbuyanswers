import type { Metadata } from "next";
import Link from "next/link";
import { CuricartBridge } from "@/components/CuricartBridge";
import { QuestionCard } from "@/components/QuestionCard";
import { contentConfig } from "@/lib/content";
import { publicQuestions, publicTopics } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: contentConfig.homeTitle,
  description: `Search approved ${siteConfig.targetAgent} answers by task. Questions stay private until their evidence and facts pass review.`,
  alternates: { canonical: "/" },
};

export default function Home() {
  const schema = { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.brand, url: siteConfig.url, description: siteConfig.description };
  const featured = publicQuestions.slice(0, 3);
  const bridgeItems = publicQuestions.flatMap((question) => question.curicartBridge);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="hero">
        <h1>{contentConfig.homeTitle}</h1>
        <p>{contentConfig.homeSubtitle}</p>
        <form className="search-shell" action="/questions" role="search">
          <label className="sr-only" htmlFor="home-search">{contentConfig.searchLabel}</label>
          <input id="home-search" name="q" placeholder={contentConfig.searchPlaceholder} autoComplete="off" />
          <button type="submit">Search</button>
        </form>
      </section>

      {featured.length > 0 ? (
        <section className="home-section" aria-labelledby="featured-questions">
          <div className="section-heading">
            <p className="eyebrow">Approved answers</p>
            <h2 id="featured-questions">Featured questions</h2>
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

      {publicTopics.length > 0 ? (
        <section className="home-section" aria-labelledby="category-entry">
          <div className="section-heading">
            <p className="eyebrow">Browse by task</p>
            <h2 id="category-entry">Categories</h2>
          </div>
          <div className="topic-pills">
            {publicTopics.map((topic) => <Link href={`/topics/${topic}`} key={topic}>{topic}</Link>)}
          </div>
        </section>
      ) : null}

      <section className="home-section" aria-labelledby="recent-questions">
        <div className="section-heading">
          <p className="eyebrow">Latest approved</p>
          <h2 id="recent-questions">Recent questions</h2>
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

      <div className="home-section">
        <CuricartBridge items={bridgeItems} contentSlug="home" title="CuriCart category bridge" />
      </div>
    </main>
  );
}

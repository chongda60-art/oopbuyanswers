import type { Metadata } from "next";
import { QuestionCard } from "@/components/QuestionCard";
import { contentConfig, publicQuestions } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Questions", description: `Approved and published ${siteConfig.targetAgent} research questions.`, alternates: { canonical: "/questions" } };

export default function QuestionsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  void searchParams;
  return (
    <main className="page">
      <header className="page-heading">
        <h1>Questions</h1>
        <p>Approved and published only.</p>
      </header>
      <form className="library-search" role="search">
        <label className="sr-only" htmlFor="question-search">{contentConfig.searchLabel}</label>
        <input id="question-search" name="q" placeholder={contentConfig.searchPlaceholder} autoComplete="off" />
        <label>
          <span>Topic</span>
          <select name="topic" disabled><option>All topics</option></select>
        </label>
        <label>
          <span>Updated</span>
          <select name="updated" disabled><option>Any time</option></select>
        </label>
      </form>
      {publicQuestions.length === 0 ? (
        <section className="empty-state compact">
          <h2>No approved answers match this search.</h2>
          <p>Search is not recorded. No submission is created.</p>
        </section>
      ) : (
        <section className="question-grid library-grid">
          {publicQuestions.map((question) => <QuestionCard question={question} key={question.id} />)}
        </section>
      )}
    </main>
  );
}

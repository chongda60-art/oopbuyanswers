import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CuricartBridge } from "@/components/CuricartBridge";
import { QuestionCard } from "@/components/QuestionCard";
import { getTopicQuestions, publicTopics } from "@/lib/content";

export function generateStaticParams() {
  return publicTopics.map((topic) => ({ topic }));
}

export function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  return params.then(({ topic }) => ({
    title: `${topic} questions`,
    description: `Oopbuy Answers questions for ${topic}.`,
    alternates: { canonical: `/topics/${topic}` },
  }));
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const questions = getTopicQuestions(topic);
  if (questions.length === 0) notFound();

  const bridgeItems = questions.flatMap((question) => question.curicartBridge);

  return (
    <main className="page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/topics">Topics</Link>
        <span aria-hidden="true">/</span>
        <span>{topic}</span>
      </nav>
      <header className="page-heading">
        <p className="eyebrow">Topic</p>
        <h1>{topic} questions</h1>
        <p>Find focused answers for related Oopbuy questions without sorting through duplicate wording.</p>
      </header>
      <section className="question-grid">
        {questions.map((question) => <QuestionCard question={question} key={question.id} />)}
      </section>
      <CuricartBridge items={bridgeItems} contentSlug={topic} context="topic" />
    </main>
  );
}

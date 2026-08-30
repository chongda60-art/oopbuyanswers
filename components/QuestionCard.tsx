import Link from "next/link";
import type { QuestionRecord } from "@/lib/content";

export function QuestionCard({ question }: { question: QuestionRecord }) {
  return (
    <article className="question-card">
      <div>
        <p className="eyebrow">{question.topic}</p>
        <h2>
          <Link href={`/questions/${question.slug}`}>{question.title}</Link>
        </h2>
        <p>{question.summary || question.quickAnswer}</p>
      </div>
      <Link className="text-cta" href={`/questions/${question.slug}`}>Read answer</Link>
    </article>
  );
}

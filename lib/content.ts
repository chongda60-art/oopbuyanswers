import siteContent from "@/content/site.json";
import questions from "@/content/questions.json";

export type QuestionStatus = "draft" | "review" | "approved" | "published" | "archived" | "hold";

export type QuestionSource = {
  type: string;
  label: string;
  url: string;
  checkedAt: string;
  proves: string;
};

export type QuestionFaq = {
  question: string;
  answer: string;
};

export type QuestionBodySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
};

export type ProductPreviewBridge = {
  type: "productPreview";
  productName: string;
  imageUrl: string;
  curicartCategory: string;
  styleOrSku: string;
  sourceType: string;
  canonicalUrl: string;
  utmUrl: string;
  matchReason: string;
  verifiedAt: string;
  status: "approved" | "current" | "stale" | "hold";
  matchStatus?: "approved" | "current" | "stale" | "hold";
};

export type CategoryLinkBridge = {
  type: "categoryLink";
  categoryName: string;
  canonicalUrl: string;
  utmUrl: string;
  matchReason: string;
  status: "approved" | "current" | "stale" | "hold";
  matchStatus?: "approved" | "current" | "stale" | "hold";
};

export type CuricartBridgeItem = ProductPreviewBridge | CategoryLinkBridge;

export type QuestionRecord = {
  id: string;
  slug: string;
  targetKeyword: string;
  title: string;
  h1: string;
  metaDescription?: string;
  summary: string;
  status: QuestionStatus;
  indexable?: boolean;
  primaryKeyword: string;
  searchIntent: string;
  topic: string;
  priority: number;
  updatedAt: string;
  quickAnswer: string;
  evidenceSummary: string;
  bodySections?: QuestionBodySection[];
  steps: string[];
  mistakes: string[];
  unknowns: string[];
  faq: QuestionFaq[];
  sources: QuestionSource[];
  relatedTopics: string[];
  relatedQuestions: string[];
  curicartBridge: CuricartBridgeItem[];
};

export const contentConfig = siteContent;

export const allQuestions = questions as QuestionRecord[];

export const publicQuestions = allQuestions.filter((question) => question.status === "approved" || question.status === "published");

export const indexableQuestions = publicQuestions.filter((question) => question.indexable === true);

export const isIndexableQuestion = (question: QuestionRecord) => question.indexable === true;

export const getPublicQuestion = (slug: string) => publicQuestions.find((question) => question.slug === slug);

export const publicTopics = Array.from(new Set(publicQuestions.flatMap((question) => question.relatedTopics)));

export const getTopicQuestions = (topic: string) =>
  publicQuestions.filter((question) => question.topic === topic || question.relatedTopics.includes(topic));

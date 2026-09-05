import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const questionsPath = path.join(projectRoot, "content", "questions.json");
const slugArgIndex = process.argv.indexOf("--slug");
const onlySlug = slugArgIndex >= 0 ? process.argv[slugArgIndex + 1] : "";

const drafts = [
  {
    slug: "oopbuy-qc-finder",
    file: "OOPBUY_QC_FINDER_EXPANDED.md",
    title: "What Can an Oopbuy QC Finder Actually Verify?",
    h1: "What Can an Oopbuy QC Finder Actually Verify?",
    metaDescription: "Learn what an Oopbuy QC finder can verify from photos and source records, what it cannot prove, and how to compare item details safely.",
  },
  {
    slug: "oopbuy-spreadsheet-with-qc",
    file: "OOPBUY_SPREADSHEET_WITH_QC_EXPANDED.md",
    title: "What Should an Oopbuy Spreadsheet With QC Include?",
    h1: "What Should an Oopbuy Spreadsheet With QC Include?",
    metaDescription: "Use this checklist to judge whether an Oopbuy spreadsheet with QC includes source links, image context, SKU, size, price reference, and update notes.",
  },
  {
    slug: "oopbuy-shoe-size-chart",
    file: "OOPBUY_SHOE_SIZE_CHART_EXPANDED.md",
    title: "How Should You Compare Oopbuy Shoe Size Labels?",
    h1: "How Should You Compare Oopbuy Shoe Size Labels?",
    metaDescription: "Compare Oopbuy shoe size labels with source options, seller charts, units, style records, and visible measurements before choosing a size.",
  },
  {
    slug: "oopbuy-weidian-link",
    file: "OOPBUY_WEIDIAN_LINK_EXPANDED.md",
    title: "How Should You Read an Oopbuy Weidian Link?",
    h1: "How Should You Read an Oopbuy Weidian Link?",
    metaDescription: "Learn how to read an Oopbuy Weidian link by preserving the source URL, itemID, title, photos, SKU, size, price reference, and link state.",
  },
  {
    slug: "oopbuy-taobao-link",
    file: "OOPBUY_TAOBAO_LINK_NOT_WORKING_DRAFT.md",
    title: "Why Is My Taobao Product Link Not Working on Oopbuy?",
    h1: "Why Is My Taobao Product Link Not Working on Oopbuy?",
    metaDescription: "Learn how to check a Taobao product link that does not work on Oopbuy by preserving the URL, item ID, source page, visible error, and product details.",
    curicartBridge: [
      {
        type: "categoryLink",
        categoryName: "Accessories",
        canonicalUrl: "https://www.curicart.com/en/Productlistt_9.html?fuid=9&&category=Accessories",
        utmUrl: "https://www.curicart.com/en/Productlistt_9.html?fuid=9&&category=Accessories&utm_source=oopbuyanswers&utm_medium=referral&utm_campaign=oopbuy_questions&utm_content=question_related_accessories",
        matchReason: "Compare product examples with visible photos, options, and source-page context while checking a Taobao link.",
        status: "approved",
      },
      {
        type: "categoryLink",
        categoryName: "Shoe",
        canonicalUrl: "https://www.curicart.com/en/Productlistt_1.html?fuid=1&&category=Shoe",
        utmUrl: "https://www.curicart.com/en/Productlistt_1.html?fuid=1&&category=Shoe&utm_source=oopbuyanswers&utm_medium=referral&utm_campaign=oopbuy_questions&utm_content=question_related_shoe",
        matchReason: "Browse shoe examples when a source link needs image, style, SKU, or size comparison.",
        status: "approved",
      },
    ],
  },
];

function cleanInline(value) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanPublicHeading(value) {
  const heading = cleanInline(value);
  if (heading === "Step 7: Make Unknowns Visible") {
    return "Step 7: Mark Missing Details Clearly";
  }
  return heading;
}

function splitSections(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("# ")) continue;
    if (/^\*\*(Target keyword|Recommended URL|Search intent):/.test(line)) continue;

    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2 || h3) {
      current = { heading: cleanPublicHeading((h2 || h3)[1]), lines: [] };
      sections.push(current);
      continue;
    }
    if (current) current.lines.push(line);
  }
  return sections;
}

function sectionToBody(section) {
  const body = { heading: section.heading };
  const paragraphs = [];
  const bullets = [];
  const ordered = [];

  for (const line of section.lines) {
    const bullet = line.match(/^-\s+(.+)$/);
    const number = line.match(/^\d+\.\s+(.+)$/);
    if (bullet) bullets.push(cleanInline(bullet[1]));
    else if (number) ordered.push(cleanInline(number[1]));
    else paragraphs.push(cleanInline(line));
  }

  if (paragraphs.length) body.paragraphs = paragraphs;
  if (bullets.length) body.bullets = bullets;
  if (ordered.length) body.ordered = ordered;
  return body;
}

function parseDraft(markdown) {
  const finalDraftMatch = markdown.match(/^# Final English Draft\s*$/m);
  const publicMarkdown = finalDraftMatch
    ? markdown.slice(finalDraftMatch.index + finalDraftMatch[0].length)
    : markdown;
  const sections = splitSections(publicMarkdown);
  const quick = sections.find((section) => section.heading === "Quick Answer");
  const faqStart = sections.findIndex((section) => section.heading === "FAQ" || section.heading === "Frequently Asked Questions");
  const referencesStart = sections.findIndex((section) => section.heading === "References Used for This Guide");
  const relatedProductStart = sections.findIndex((section) => section.heading === "Related Product Research");

  const stopIndexes = [faqStart, referencesStart, relatedProductStart].filter((index) => index >= 0);
  const bodyEnd = stopIndexes.length ? Math.min(...stopIndexes) : sections.length;
  const bodySections = sections
    .slice(0, bodyEnd)
    .filter((section) => section.heading !== "Quick Answer")
    .map(sectionToBody);

  const faqSections = [];
  if (faqStart >= 0) {
    const faqEnd = referencesStart >= 0 ? referencesStart : sections.length;
    for (const section of sections.slice(faqStart + 1, faqEnd)) {
      faqSections.push({
        question: section.heading,
        answer: cleanInline(section.lines.join(" ")),
      });
    }
  }

  return {
    quickAnswer: cleanInline(quick?.lines.join(" ") || ""),
    bodySections,
    faq: faqSections,
  };
}

const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
const selectedDrafts = onlySlug ? drafts.filter((draft) => draft.slug === onlySlug) : drafts;
if (onlySlug && selectedDrafts.length !== 1) {
  throw new Error(`Unknown draft slug: ${onlySlug}`);
}

for (const draft of selectedDrafts) {
  const draftPath = path.join(projectRoot, "content", "oopbuy-first-10", "drafts", draft.file);
  const parsed = parseDraft(fs.readFileSync(draftPath, "utf8"));
  if (!parsed.quickAnswer) throw new Error(`Missing Quick Answer in ${draft.file}`);
  if (parsed.faq.length !== 5) throw new Error(`Expected 5 FAQ items in ${draft.file}, got ${parsed.faq.length}`);

  const question = questions.find((item) => item.slug === draft.slug);
  if (!question) throw new Error(`Question not found: ${draft.slug}`);

  question.title = draft.title;
  question.h1 = draft.h1;
  question.metaDescription = draft.metaDescription;
  question.quickAnswer = parsed.quickAnswer;
  question.bodySections = parsed.bodySections;
  question.faq = parsed.faq;
  question.status = "approved";
  question.indexable = true;
  if (draft.curicartBridge) question.curicartBridge = draft.curicartBridge;
}

fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);
console.log(`Imported ${selectedDrafts.length} expanded drafts into ${questionsPath}`);

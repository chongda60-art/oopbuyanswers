import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const questionsPath = path.join(projectRoot, "content", "questions.json");
const today = new Date().toISOString().slice(0, 10);

const shoeCategory = {
  type: "categoryLink",
  categoryName: "Shoe",
  canonicalUrl: "https://www.curicart.com/en/Productlistt_1.html?fuid=1&&category=Shoe",
  utmUrl: "https://www.curicart.com/en/Productlistt_1.html?fuid=1&&category=Shoe&utm_source=oopbuyanswers&utm_medium=referral&utm_campaign=oopbuy_questions&utm_content=question_related_shoe",
  matchReason: "Browse current shoe records while comparing spreadsheet fields, images, size labels, and source-page context.",
  status: "approved",
};

const oopbuyTopic = {
  type: "categoryLink",
  categoryName: "Oopbuy product research",
  canonicalUrl: "https://www.curicart.com/en/agentslist_12.html?spreadsheet=Oopbuy",
  utmUrl: "https://www.curicart.com/en/agentslist_12.html?spreadsheet=Oopbuy&utm_source=oopbuyanswers&utm_medium=referral&utm_campaign=oopbuy_questions&utm_content=question_related_oopbuy_product_research",
  matchReason: "Browse Oopbuy-related product research examples before checking warehouse photo status.",
  status: "approved",
};

const drafts = [
  {
    slug: "oopbuy-qc-photos-not-showing",
    file: "OOPBUY_QC_PHOTOS_NOT_SHOWING_DRAFT.md",
    title: "Why Are My Oopbuy QC Photos Not Showing After Warehouse Arrival?",
    h1: "Why Are My Oopbuy QC Photos Not Showing After Warehouse Arrival?",
    targetKeyword: "oopbuy qc photos not showing after warehouse arrival",
    primaryKeyword: "oopbuy qc photos not showing",
    searchIntent: "Help shoppers troubleshoot missing Oopbuy QC photos after a warehouse-related status appears.",
    topic: "qc",
    priority: 6,
    summary: "Check the item record, current status, update time, SKU, and photo area before assuming warehouse QC photos are missing.",
    metaDescription: "Oopbuy QC photos not showing after warehouse arrival? Check the item status, identifier, image area, update time, and current support information.",
    relatedTopics: ["qc", "product-links"],
    relatedQuestions: ["oopbuy-qc-photos", "oopbuy-qc-finder", "oopbuy-spreadsheet-with-qc"],
    curicartBridge: [oopbuyTopic],
  },
  {
    slug: "oopbuy-spreadsheet-shoes",
    file: "OOPBUY_SPREADSHEET_SHOES_DRAFT.md",
    title: "How Should You Check an Oopbuy Spreadsheet for Shoes?",
    h1: "How Should You Check an Oopbuy Spreadsheet for Shoes?",
    targetKeyword: "oopbuy spreadsheet shoes",
    primaryKeyword: "oopbuy spreadsheet shoes",
    searchIntent: "Show shoppers how to check shoe spreadsheet rows by source link, itemID, images, style, size, and price reference.",
    topic: "spreadsheet",
    priority: 7,
    summary: "Use a shoe spreadsheet checklist for model, source URL, itemID, image type, size labels, price references, and row freshness.",
    metaDescription: "Check an Oopbuy shoe spreadsheet by comparing source links, itemID, product photos, style, size labels, price references, and update dates.",
    relatedTopics: ["spreadsheet", "sku-size", "product-links"],
    relatedQuestions: ["oopbuy-spreadsheet-with-qc", "oopbuy-shoe-size-chart", "oopbuy-weidian-link"],
    curicartBridge: [
      {
        type: "productPreview",
        productName: "THE ROGER Clubhouse Pro Tennis Shoes",
        imageUrl: "https://si.geilicdn.com/pcitem1970743960-67620000019f5b60f42e0a20e7c7_800_800.jpg",
        curicartCategory: "Shoe",
        styleOrSku: "Style 30 · EU36=WUS5=UK3=JP22",
        sourceType: "CuriCart product record",
        canonicalUrl: "https://www.curicart.com/en/productview_4234_80.html?proname=on-the-roger-clubhouse-pro-tennis-shoes",
        utmUrl: "https://www.curicart.com/en/productview_4234_80.html?proname=on-the-roger-clubhouse-pro-tennis-shoes&utm_source=oopbuyanswers&utm_medium=referral&utm_campaign=oopbuy_questions&utm_content=question_related_the_roger_clubhouse_pro_tennis_shoes",
        matchReason: "Use this record to compare shoe photos, Style 30, source context, and visible size labels.",
        verifiedAt: today,
        status: "approved",
      },
      {
        type: "productPreview",
        productName: "On Cloudmonster 1 Men's Cushioned Everyday Shoe White Gray",
        imageUrl: "https://si.geilicdn.com/pcitem1970743960-19d20000019f568634910a81347d_800_800.jpg",
        curicartCategory: "Shoe",
        styleOrSku: "Style 21 · EU36=WUS5=UK3=JP22",
        sourceType: "CuriCart product record",
        canonicalUrl: "https://www.curicart.com/en/productview_4203_79.html?proname=on-cloudmonster-1-running-shoes",
        utmUrl: "https://www.curicart.com/en/productview_4203_79.html?proname=on-cloudmonster-1-running-shoes&utm_source=oopbuyanswers&utm_medium=referral&utm_campaign=oopbuy_questions&utm_content=question_related_on_cloudmonster_1_men_s_cushioned_everyday_shoe_white_gray",
        matchReason: "Use this record to compare a shoe title, Style 21, photos, and repeated size-label format.",
        verifiedAt: today,
        status: "approved",
      },
      {
        type: "productPreview",
        productName: "Nike Mind 001 Flyknit QS Slides",
        imageUrl: "https://si.geilicdn.com/pcitem1970743960-71ac0000019f547907d60a231316_800_800.jpg",
        curicartCategory: "Shoe",
        styleOrSku: "Style 16 · EU36=US4=UK3.5=CM23.0",
        sourceType: "CuriCart product record",
        canonicalUrl: "https://www.curicart.com/en/productview_4160_77.html?proname=nike-slides-sandals",
        utmUrl: "https://www.curicart.com/en/productview_4160_77.html?proname=nike-slides-sandals&utm_source=oopbuyanswers&utm_medium=referral&utm_campaign=oopbuy_questions&utm_content=question_related_nike_mind_001_flyknit_qs_slides",
        matchReason: "Use this record to compare slide photos, Style 16, size labels, and source-page context.",
        verifiedAt: today,
        status: "approved",
      },
      shoeCategory,
    ],
  },
];

function cleanInline(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSections(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("# ")) continue;
    if (/^\*\*(Target keyword|Recommended URL|Search intent|Suggested meta description):/.test(line)) continue;

    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2 || h3) {
      current = { heading: cleanInline((h2 || h3)[1]), lines: [] };
      sections.push(current);
      continue;
    }
    if (current) current.lines.push(line);
  }
  return sections;
}

function lineToParts(line, paragraphs, bullets, ordered) {
  const bullet = line.match(/^-\s+(.+)$/);
  const number = line.match(/^\d+\.\s+(.+)$/);
  const table = line.match(/^\|(.+)\|$/);
  if (bullet) bullets.push(cleanInline(bullet[1]));
  else if (number) ordered.push(cleanInline(number[1]));
  else if (table && !/^\|?\s*:?-{3,}:?\s*\|/.test(line)) {
    const cells = table[1].split("|").map((cell) => cleanInline(cell)).filter(Boolean);
    if (cells.length) bullets.push(cells.join(" — "));
  } else paragraphs.push(cleanInline(line));
}

function sectionToBody(section) {
  const body = { heading: section.heading };
  const paragraphs = [];
  const bullets = [];
  const ordered = [];

  for (const line of section.lines) {
    lineToParts(line, paragraphs, bullets, ordered);
  }

  if (paragraphs.length) body.paragraphs = paragraphs;
  if (bullets.length) body.bullets = bullets;
  if (ordered.length) body.ordered = ordered;
  return body;
}

function parseDraft(markdown) {
  const sections = splitSections(markdown);
  const quick = sections.find((section) => section.heading === "Quick Answer");
  const faqStart = sections.findIndex((section) => section.heading === "FAQ");
  const stopHeadings = new Set(["References Used for This Guide"]);
  const firstStopHeading = sections.findIndex((section) => stopHeadings.has(section.heading));
  const stopIndexes = [faqStart, firstStopHeading].filter((index) => index >= 0);
  const bodyEnd = stopIndexes.length ? Math.min(...stopIndexes) : sections.length;

  const bodySections = sections
    .slice(0, bodyEnd)
    .filter((section) => section.heading !== "Quick Answer")
    .map(sectionToBody);

  const faq = [];
  if (faqStart >= 0) {
    const referencesStart = sections.findIndex((section) => section.heading === "References Used for This Guide");
    const faqEnd = referencesStart >= 0 ? referencesStart : sections.length;
    for (const section of sections.slice(faqStart + 1, faqEnd)) {
      faq.push({ question: section.heading, answer: cleanInline(section.lines.join(" ")) });
    }
  }

  return { quickAnswer: cleanInline(quick?.lines.join(" ") || ""), bodySections, faq };
}

const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

for (const draft of drafts) {
  const draftPath = path.join(projectRoot, "content", "oopbuy-second-batch", "drafts", draft.file);
  const parsed = parseDraft(fs.readFileSync(draftPath, "utf8"));
  if (!parsed.quickAnswer) throw new Error(`Missing Quick Answer in ${draft.file}`);
  if (parsed.faq.length !== 5) throw new Error(`Expected 5 FAQ items in ${draft.file}, got ${parsed.faq.length}`);

  const record = {
    id: `q-${draft.slug}`,
    slug: draft.slug,
    targetKeyword: draft.targetKeyword,
    title: draft.title,
    h1: draft.h1,
    metaDescription: draft.metaDescription,
    summary: draft.summary,
    status: "approved",
    indexable: true,
    primaryKeyword: draft.primaryKeyword,
    searchIntent: draft.searchIntent,
    topic: draft.topic,
    priority: draft.priority,
    updatedAt: today,
    quickAnswer: parsed.quickAnswer,
    evidenceSummary: draft.summary,
    bodySections: parsed.bodySections,
    steps: [],
    mistakes: [],
    unknowns: [],
    faq: parsed.faq,
    sources: [],
    relatedTopics: draft.relatedTopics,
    relatedQuestions: draft.relatedQuestions,
    curicartBridge: draft.curicartBridge,
  };

  const index = questions.findIndex((item) => item.slug === draft.slug);
  if (index >= 0) questions[index] = { ...questions[index], ...record };
  else questions.push(record);
}

fs.writeFileSync(questionsPath, `${JSON.stringify(questions, null, 2)}\n`);
console.log(`Imported ${drafts.length} second-batch drafts into ${questionsPath}`);

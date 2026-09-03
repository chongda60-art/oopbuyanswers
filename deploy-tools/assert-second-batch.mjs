const urls = [
  "https://oopbuyanswers.com/questions/oopbuy-qc-photos-not-showing",
  "https://oopbuyanswers.com/questions/oopbuy-spreadsheet-shoes",
];

const forbidden = [
  "The user wants",
  "Evidence summary",
  "Unknowns",
  "topic_map",
  "checked 2026",
  "approval",
  "review gate",
  "bridge",
  "UTM",
  "source method",
  "local product detail copy",
  "CuriCart Bridge",
  "These links leave",
  "Open category on CuriCart",
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
}

function countWords(text) {
  return (text.match(/[A-Za-z][A-Za-z'-]*/g) || []).length;
}

let failed = false;

for (const url of urls) {
  const res = await fetch(url);
  const html = await res.text();
  const h1 = (html.match(/<h1[\s\S]*?<\/h1>/gi) || []).length;
  const robots = (html.match(/<meta[^>]+name=["']robots["'][^>]*>/i) || [""])[0];
  const faqJson = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1])
    .join("\n");
  const faqCount = (faqJson.match(/"@type"\s*:\s*"Question"/g) || []).length;
  const badText = forbidden.filter((term) => html.includes(term));
  const curicartLinks = [...html.matchAll(/href="(https:\/\/www\.curicart\.com[^"]*)"/g)]
    .map((match) => match[1].replace(/&amp;/g, "&"));
  const badLinks = curicartLinks.filter(
    (href) =>
      href.includes("\\") ||
      !href.includes("utm_source=oopbuyanswers") ||
      !href.includes("utm_medium=referral") ||
      !href.includes("utm_campaign=oopbuy_questions"),
  );
  const words = countWords(stripHtml(html));
  const result = {
    url,
    status: res.status,
    h1,
    robots,
    words,
    faqCount,
    badText,
    badLinks: badLinks.length,
    curicartLinks: curicartLinks.length,
  };
  console.log(JSON.stringify(result));
  if (
    res.status !== 200 ||
    h1 !== 1 ||
    !robots.includes("index, follow") ||
    words < 1200 ||
    faqCount !== 5 ||
    badText.length ||
    badLinks.length
  ) {
    failed = true;
  }
}

const sitemapXml = await (await fetch("https://oopbuyanswers.com/sitemap.xml")).text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const sitemapResult = {
  sitemap: "https://oopbuyanswers.com/sitemap.xml",
  sitemap_count: sitemapUrls.length,
  has_new: urls.map((url) => sitemapUrls.includes(url)),
};
console.log(JSON.stringify(sitemapResult));

if (sitemapUrls.length !== 18 || sitemapResult.has_new.includes(false)) {
  failed = true;
}

if (failed) {
  process.exit(1);
}

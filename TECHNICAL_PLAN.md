# CNFans research-tool pilot: technical plan

## Goal and approved boundary

Build one local, real utility-style SEO pilot in `F:\seojieliu`. The pilot helps users inspect CNFans spreadsheet and product-link records by exposing images, SKU/style fields, sizes, reference price, original source URL, CuriCart URL when available, update time, and record status.

The owner has **not** approved a domain purchase, deployment, search-engine submission, or any change to `curicart.com`. Public brand remains `SITE_BRAND`; `TARGET_AGENT` is `CNFans`. The site must state that it is independent and must not use the CNFans logo or imply affiliation.

## Technical selection

- Framework: Next.js App Router + TypeScript + React.
- Reason: the directory was empty and had no `.openai/hosting.json`; Next.js provides crawlable server/static HTML, route metadata, static params, sitemap, robots, image sizing, 404 handling, and a clear read-only adapter boundary.
- Hosting: none in phase 1. The OpenAI Sites scaffold is not forced into a repository that did not already declare Sites hosting.
- Styling: code-native CSS following the approved generated concept: true-white background, open tables/lists, restrained cobalt actions, clear focus states, and minimal decorative UI.
- Runtime: bundled Codex Node runtime and pnpm. Lockfile is generated during installation.

## Routes

| Route | Phase 1 behavior | Indexing intent |
|---|---|---|
| `/` | Complete search-led home and fixture discovery table | Indexable in a future approved deployment |
| `/spreadsheet` | Crawlable fixture list, non-indexable filter parameters | Indexable clean URL only |
| `/qcfinder` | Honest empty state until a verified QC data source exists | `noindex` in phase 1 |
| `/category/[slug]` | One `accessories` category, pagination shell and empty-state support | Indexable when non-empty |
| `/product/[slug]` | One page per active fixture; source disclosure and validation checklist | Indexable active records only |
| `/request-product` | Local-only interaction; no backend submission | Disallowed/no publication target |
| future `/guides/[slug]` | Reserved; blocked by the Content Research Gate | Not implemented |

## Component map

- `Header`: configurable brand and required navigation.
- `SearchBox`: keyboard-accessible search event and URL query handoff.
- `ProductFilters`: filter-event placeholder; does not create canonical parameter pages.
- `ProductTable`: responsive scroll region with product research fields.
- `Breadcrumbs`: visible breadcrumbs reused on category and product routes.
- `TrackedSourceLink`: explicit external source with `noopener`, `noreferrer`, `nofollow`, and `source_click` event.
- Route components: home, spreadsheet, category, product, QC empty state, request form, and 404.

## Product data model

Required fields are implemented in `Product`: `id`, `slug`, `title`, `brand`, `category`, `images`, `reference_price`, `currency`, `sku_count`, `sizes`, `source_url`, `curicart_url`, `updated_at`, and `status`. Phase 1 also adds `style_number` and `fixture_note` so uncertainty is visible rather than hidden.

## Read-only CuriCart API contract

`ReadonlyCatalogAdapter` defines only three non-mutating operations:

```ts
listProducts(): Promise<Product[]>
getProduct(slug: string): Promise<Product | null>
listByCategory(category: string): Promise<Product[]>
```

No endpoint, authentication method, pagination protocol, or response envelope is guessed. Local fixtures are explicitly marked. A real adapter requires the current read-only endpoint, authentication mechanism, rate limits, pagination, field mapping, image rights, update semantics, removal semantics, and error contract.

## SEO rules

- Server/static HTML contains each page's primary content.
- Every implemented page has a distinct Title, description, and one H1.
- Every indexable clean route has a self-referencing canonical.
- Sitemap contains only the home, spreadsheet, one non-empty category, and active fixture product pages. It excludes `qcfinder`, request form, filter/query URLs, and missing/removed products.
- `lastmod` comes from actual fixture update fields, not build time.
- Removed records are filtered from listing and sitemap; unknown product slugs return 404. A future API may supply an explicit removal timestamp/reason needed for a deliberate 410 policy.
- `robots.txt` declares the sitemap and prevents parameter/query crawling plus the request form.
- Category pagination must use crawlable clean page URLs only when the verified dataset exceeds one page. Empty categories must not enter the sitemap.
- Schema is content-bound: WebSite on home, ItemList on spreadsheet, Product without fabricated Offer/Review fields on a product, and visible Breadcrumb UI. FAQ schema is prohibited unless visible eligible FAQ content exists.
- Images have fixed intrinsic dimensions, useful alt text, lazy loading by default, and only the main product image uses priority loading.
- External links are direct and visible. No cloaking, hidden anchors, misleading buttons, or redirect chains are introduced.

## Analytics reservation

The local client dispatches five keyless custom events: `search`, `filter`, `product_view` (reserved for wiring when consent/measurement design is approved), `source_click`, and `request_submit`. No GA/GTM/property ID or real account secret is present.

## Content Research Gate

No full guide/article may be drafted or published until all gates pass:

1. Research public Reddit buy/agent communities for repeated questions about agents, spreadsheets, QC, Weidian/Taobao links, SKU/style/size confusion, dead links, currency, country availability, fees, warehouses, and restricted items. Do not access private communities, bypass login, or recover deleted content.
2. Store per-source evidence in `research/reddit_questions.csv`. Reddit demonstrates demand or community opinion only. It does not establish platform fees, shipping, policy, authenticity, inventory, timelines, support, or service quality.
3. A pain point is “high frequency” only after multiple independent Reddit sources or Reddit plus a second demand source such as autocomplete, GSC, Bing, or Trends. One source is only “discovered demand.” Search volume remains Unknown unless measured evidence is supplied.
4. Verify every platform fact against a current official platform/help page. Mark unverifiable claims `Unknown`.
5. Deliver the research report, Top 10 opportunities, Top 3 briefs, and `CONTENT_OWNERSHIP_MATRIX.md` to the SEO Strategy Director. No complete article is written until approved.
6. Every approved draft must include a direct answer, evidence-led steps/checklist, verified-vs-Unknown separation, evidenced CuriCart examples only, risks/limits, related FAQ, natural internal links, and independent Title/Meta/H1/search intent.
7. The Content Growth Editor reviews a finished draft, then the SEO Strategy Director approves it before publication. This applies to both the main site and this pilot.

### Video and media evidence gate

- Use only public videos through the platform's official Embed/oEmbed. Never download, edit, copy, or rehost another creator's video or thumbnail.
- Record platform, title, author/channel, public URL, visible publication date, useful timestamps, and the narrow point the video demonstrates.
- Video/social evidence proves only what someone publicly showed or discussed. Fees, shipping, policy, authenticity, inventory, timelines, and service promises still require current official verification or remain `Unknown`.
- Article text must stand alone. Add an original summary, observations, and limitations beside an embed; do not reproduce full transcripts or long quotes.
- Default to 1–2 directly relevant videos. No autoplay. Lazy-load a responsive fixed 16:9 frame to avoid CLS. Prefer `youtube-nocookie.com` where compatible and TikTok official oEmbed. Preserve source URLs and useful text if the embed disappears.
- Use `VideoObject` or a video sitemap only when one verifiable video is the page's primary above-the-fold content. Do not add video schema to ordinary supporting embeds.
- Video evidence supplements but never replaces the Reddit demand gate or official fact verification.

### Cross-site originality gate

- CuriCart owns platform-neutral shopping-agent research, cross-platform comparisons, general photo/SKU/source-link verification, real CuriCart cases, and generic checklists.
- The CNFans pilot owns only CNFans search tasks, spreadsheet/link usage problems, CNFans-specific faults and questions, and CNFans-oriented directory/tool queries.
- Assign one Primary Owner for every core search intent. The other site may publish only a materially different complementary intent, with a natural link to the owner when useful; it may not create a doorway.
- Never copy or rephrase body text, paragraph order, H2/H3 structure, FAQ, conclusions, example combinations, screenshot combinations, or CTA. Never translate, shorten, or AI-paraphrase a CuriCart article for this pilot. No platform-name variable substitution.
- Before publication, mechanically flag exact sequences of 8 or more words shared across sites, excluding necessary legal wording and names. A human reviewer must also compare user task, evidence set, structure, examples, conclusion, and value. No single originality percentage is sufficient.
- Every draft carries: `primary_keyword`, `search_intent`, `page_owner`, `compared_existing_urls`, `unique_evidence`, `unique_user_task`, `unique_examples`, `duplicate_heading_check`, `exact_long_sentence_check`, `why_this_page_is_not_a_rewrite`, and `cannibalization_risk`.
- Failure of any originality field returns the draft. The SEO Strategy Director must re-review before a corresponding second-site version is drafted or published.

## Risks and unknowns

- Public brand and domain: not approved.
- Real CuriCart API endpoint and data licensing: Unknown.
- Live product facts, listing status, images, reference prices, SKU/style and sizes: fixtures only; Unknown.
- Current CNFans support, fees, currency behavior, shipping, countries, restrictions, and policies: not established by Reddit and Unknown until official verification.
- Search volume, ranking difficulty, conversion rate, and revenue potential: Unknown.
- Legal/trademark review for a CNFans-focused public domain and copy: pending owner approval.
- 410 policy needs a trusted removal signal and retention policy.

## Phase 1 acceptance

Build, type-check, lint, route/metadata/schema/static checks, desktop/mobile Playwright screenshots, keyboard checks, and a local Lighthouse/performance pass. Save evidence in `reports/`. Stop locally.

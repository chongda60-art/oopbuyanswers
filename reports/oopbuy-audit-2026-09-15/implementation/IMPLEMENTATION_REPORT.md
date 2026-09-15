# Oopbuy Answers category-card correction

Date: 2026-09-15 (Asia/Shanghai)

## Scope completed

Only the six audit-affected question/topic bridge outputs were corrected by removing the unsupported generic category entries:

- New Products removed from the shipping-cost and shipping-time question bridges.
- The unsupported Oopbuy product research card removed from the missing-QC-photo question bridge.
- Topic pages inherit the corrected bridge data, so QC, product-links, and shipping topic outputs no longer expose those labels.
- The component fallback for the removed generic label was deleted.

No routes, sitemap, robots, canonical tags, schema, article body, site name, navigation, or unrelated cards were changed.

## Verification

- pnpm check: passed
- pnpm lint: passed
- pnpm build: passed
- validate-content.ps1: passed (Questions=12, PublicQuestions=10, HomeCategories=5)
- verify.ps1 with config.example.psd1: passed (SITEMAP_URLS=22, VERIFY_OK)
- Production: https://oopbuyanswers.com HTTP 200; www remains 308 to apex.
- Production bridge check: six affected URLs returned 200, forbidden-label count 0, bad UTM count 0, horizontal overflow false, H1 count 1.
- Full sitemap recheck: 22 URLs scanned, forbidden-label hits 0.
- CuriCart destination checks: existing 35 unique destinations remained HTTP 200; no UTM-generation change was made.
- Screenshots: six mobile 390px and six desktop captures are in this directory.

## Deployment

- Vercel deployment: dpl_5AWLq8w2WzuwWjobR2juCMUoCo7J
- Production alias: https://oopbuyanswers.com
- Preview URL: https://oopbuyanswers-8wi53vfia-chen-d2eb.vercel.app
- Inspect URL: https://vercel.com/chen-d2eb/oopbuyanswers/5AWLq8w2WzuwWjobR2juCMUoCo7J

## Git

- Local commit: 0dd2099 Remove unsupported category bridge cards
- One push attempt was made and failed with a GitHub connection reset. No retry was performed, per instruction.
- Implementation report files are local-only after the failed push; the source commit is present locally.

## Monitoring

No weekly monitor or baseline file was present in the repository at audit time, so no monitor file was changed. The existing low-token verification workflow remains available.

# Oopbuy Answers project state

Last updated: 2026-09-03 Asia/Shanghai

## Fixed project identity

- Project root: `F:\seojieliu`
- Production URL: `https://oopbuyanswers.com`
- WWW URL: `https://www.oopbuyanswers.com`
- GitHub remote: `https://github.com/chongda60-art/oopbuyanswers.git`
- Vercel scope/project: `chen-d2eb/oopbuyanswers`
- Current deployed content commit: `7942f5b`
- Current production deployment observed: `dpl_4Uax6tF9CfCPdA5VVT7Fo4JzRTho`

## Indexing state

- Launch indexing is approved and enabled.
- `robots.txt` should allow `/` and reference `https://oopbuyanswers.com/sitemap.xml`.
- `sitemap.xml` should contain 18 canonical URLs.
- Public sitemap URLs must return HTTP 200, self-canonical, and `meta robots` = `index, follow`.

## Indexable question pages

- `/questions/oopbuy-qc-photos`
- `/questions/oopbuy-qc-finder`
- `/questions/oopbuy-spreadsheet-with-qc`
- `/questions/oopbuy-shoe-size-chart`
- `/questions/oopbuy-weidian-link`
- `/questions/oopbuy-qc-photos-not-showing`
- `/questions/oopbuy-spreadsheet-shoes`

## Not-public or not-indexable question pages

- `/questions/oopbuy-shipping-cost` — `status=review`, `indexable=false`
- `/questions/oopbuy-shipping-time` — `status=review`, `indexable=false`
- `/questions/oopbuy-taobao-link` — `status=review`, `indexable=false`
- `/questions/oopbuy-legit-reviews-reddit` — `status=review`, `indexable=false`
- `/questions/oopbuy-shipping-coupons` — `status=review`, `indexable=false`

## CuriCart category and UTM rules

- Only use the real CuriCart main categories: `Shoe`, `Accessories`, `Electronics`, `Clothing`, `Bags`.
- All public CuriCart links must use `https://www.curicart.com`.
- Required UTM parameters:
  - `utm_source=oopbuyanswers`
  - `utm_medium=referral`
  - `utm_campaign=oopbuy_questions`
  - `utm_content=<page_or_module_slug>`
- Do not create local Oopbuy Answers product detail pages.

## Forbidden public text checks

Public HTML must not contain internal workflow language such as:

- `The user wants`
- `Evidence summary`
- `Unknowns`
- `topic_map`
- `checked 2026`
- `first-party sources`
- `public demonstrations`
- `local product detail copy`
- `platform-specific facts marked Unknown`
- `Research pages separate`
- `CuriCart Bridge`
- `category bridge`
- `approved data`
- `approved CuriCart data`
- `referral UTM`
- `These links leave`
- `Open category on CuriCart`
- `source method`
- `What this site will publish`
- `compliance`
- `review gate`

## Standard low-token commands

Start every future run with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\status.ps1
```

Before reporting completion, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\lowtoken-verify.ps1
```

For live launch/indexing checks only:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\launch-check.ps1
```

## Recent evidence

- Latest launch verification report: `F:\seojieliu\reports\launch-verification-20260903-020211.json`
- Latest screenshots directory: `F:\seojieliu\reports\screenshots`
- Google verification file: `https://oopbuyanswers.com/googledfcd3ef6e7fa1e2b.html`

## Operating rules

- Do not modify CuriCart main site.
- Do not deploy production unless explicitly requested.
- Do not submit Google, Bing, IndexNow, Yandex, Seznam, or Yep unless explicitly requested.
- Do not paste long reports in chat. Write detailed evidence to `reports/` and return only a short summary.

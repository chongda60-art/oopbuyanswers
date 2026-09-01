# Oopbuy Answers indexing launch report

Date: 2026-09-01

## Production

- Production URL: https://oopbuyanswers.com
- Sitemap: https://oopbuyanswers.com/sitemap.xml
- GitHub repository: https://github.com/chongda60-art/oopbuyanswers
- Final Vercel deployment ID: dpl_Ac9MVqdJAwDM6DF7NqEoscPPJKet
- Final Vercel deployment URL: https://oopbuyanswers-q85cl8lx9-chen-d2eb.vercel.app
- Final commit after launch tooling fix: b68f554

## Indexing state verified

- robots.txt: HTTP 200 and allows `/`
- sitemap.xml: HTTP 200 and non-empty
- sitemap URL count: 16
- sitemap URLs: HTTP 200, self-canonical, and `index, follow`
- www host: 308 permanent redirect to https://oopbuyanswers.com/
- CuriCart links checked on `/`, `/questions`, `/questions/oopbuy-qc-photos`, `/topics/qc`, `/sources`: 13 links, bad UTM links 0

## Search discovery submissions

Submission report: `reports/search-discovery-submissions-20260901-212418.json`

- Generic IndexNow: homepage 202, first article 202
- Bing IndexNow: homepage 202, first article 200
- Yandex IndexNow: homepage 202, first article 200
- Seznam IndexNow: homepage 200, first article 200
- Yep IndexNow: homepage 200, first article 200
- Brave: not submitted. No official IndexNow endpoint was present in the current IndexNow search engine list.

## Google Search Console and Bing Webmaster Tools

- No Oopbuy Answers specific GSC/Bing Webmaster Tools automation script was found in `F:\seojieliu` or `E:\seo`.
- Chrome had a CuriCart Google Search Console tab open, not an Oopbuy Answers property. No Oopbuy sitemap was submitted inside that CuriCart property.
- Bing discovery was completed through the verified Bing IndexNow endpoint.

## Validation artifacts

- Launch verification report: `reports/launch-verification-20260901-213047.json`
- Screenshot refresh:
  - `reports/screenshots/oopbuyanswers-production-desktop.png`
  - `reports/screenshots/oopbuyanswers-production-mobile.png`
  - `reports/screenshots/oopbuyanswers-questions-desktop.png`
  - `reports/screenshots/oopbuyanswers-questions-mobile.png`
  - `reports/screenshots/oopbuyanswers-question-bridge-desktop.png`
  - `reports/screenshots/oopbuyanswers-question-bridge-mobile.png`
  - `reports/screenshots/oopbuyanswers-topic-qc-desktop.png`
  - `reports/screenshots/oopbuyanswers-topic-qc-mobile.png`

## Commands passed

- `pnpm lint`
- `pnpm check`
- `pnpm build`
- `deploy-tools/validate-content.ps1`
- `deploy-tools/verify-launch.ps1`
- `deploy-tools/assert-curicart-links.ps1`
- `deploy-tools/screenshots.ps1`
- `deploy-tools/submit-indexnow.ps1 -Execute`

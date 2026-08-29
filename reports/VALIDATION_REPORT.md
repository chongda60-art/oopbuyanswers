# Oopbuy Answers validation report

## 2026-08-30 CuriCart Bridge content-system update

- Implemented `components/CuricartBridge.tsx` for Oopbuy Answers question and topic pages.
- Bridge data source: `content/questions.json`, converted from `content/oopbuy-first-10/OOPBUY_FIRST_10_TOPIC_MAP.md`.
- Render rule: only `approved/current` bridge items with non-empty `matchReason` render.
- Product rule: max 5 `productPreview` cards per question; no product cards render until approved CuriCart product API data provides complete product name, image URL, category, Style/SKU, source type, canonical URL, UTM URL, verified date, and current status.
- Category rule: category bridge cards link only to canonical `https://www.curicart.com/...` URLs with `utm_source=oopbuyanswers`, `utm_medium=referral`, `utm_campaign=oopbuy_questions`, and `utm_content` from the question or topic slug.
- Homepage public section removed: `What this site will publish`, its paragraph, and `Read the source method` are no longer visible on production.
- `/sources` remains available.
- No local product detail pages were added; `/product/demo` remains HTTP 404.
- noindex/nofollow, robots `Disallow: /`, and empty sitemap remain active.

Validation commands passed:

- `powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\validate-content.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\build.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\verify.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\screenshots.ps1`

Production deployment:

- Deployment id: `dpl_Hq74YhF9cGAvNmZmCKHauuapesmj`
- Inspect URL: `https://vercel.com/chen-d2eb/oopbuyanswers/Hq74YhF9cGAvNmZmCKHauuapesmj`
- Production URL: `https://oopbuyanswers.com/`
- Vercel deployment URL: `https://oopbuyanswers-949fs6c11-chen-d2eb.vercel.app`

New screenshots:

- `reports/screenshots/oopbuyanswers-production-desktop.png`
- `reports/screenshots/oopbuyanswers-production-mobile.png`
- `reports/screenshots/oopbuyanswers-questions-desktop.png`
- `reports/screenshots/oopbuyanswers-questions-mobile.png`
- `reports/screenshots/oopbuyanswers-question-bridge-desktop.png`
- `reports/screenshots/oopbuyanswers-question-bridge-mobile.png`
- `reports/screenshots/oopbuyanswers-topic-qc-desktop.png`
- `reports/screenshots/oopbuyanswers-topic-qc-mobile.png`

Current limitation:

- Terminal GitHub push failed because direct terminal HTTPS access to `github.com:443` timed out/reset. Local commit `7abcf0a` exists and production was deployed directly from local source through Vercel CLI. Retry `git push origin HEAD` when terminal GitHub connectivity is available.

Status: implementation, GitHub push, Vercel production deployment, Spaceship DNS connection, HTTPS, apex/www redirect, and noindex prelaunch validation are complete.

## Local build

- TypeScript: passed.
- ESLint: passed.
- Next.js production build: passed with 14 generated routes.
- Dependency compatibility fixes: TypeScript pinned to 6.0.2 and ESLint pinned to 9.39.2 because the unbounded `latest` versions were incompatible with the installed Next ESLint stack.

## Local HTTP and content gates

- `/`, `/questions`, `/topics`, `/sources`, `/about`, `/contact`, `/privacy`: HTTP 200.
- `/spreadsheet`, `/qcfinder`, `/product/demo`: HTTP 404.
- Every HTML page checked returned `meta robots=noindex, nofollow`.
- `robots.txt`: `Disallow: /`.
- `sitemap.xml`: empty URL set while launch indexing is disabled.
- No public QC candidate, fixture product, placeholder product card, or video embed detected.

## Visual and browser checks

- Desktop viewport: 1440×1000.
- Mobile viewport: 390×844.
- Navigation, H1, search control, empty state, evidence-method link, and footer were visible in both DOM checks.
- No visible overlap or horizontal clipping observed in saved screenshots.
- Screenshots: `reports/screenshots/local-desktop.png`, `reports/screenshots/local-mobile.png`.
- Production screenshots:
  - `reports/screenshots/oopbuyanswers-production-desktop.png`
  - `reports/screenshots/oopbuyanswers-production-mobile.png`
  - `reports/screenshots/oopbuyanswers-questions-desktop.png`
  - `reports/screenshots/oopbuyanswers-questions-mobile.png`
  - `reports/screenshots/spaceship-dns-final-records.png`

## Production

- Git repository: `https://github.com/chongda60-art/oopbuyanswers`.
- Commits:
  - `bb1581f` - `Build Oopbuy Answers prelaunch research site`.
  - `149e00e` - `Ignore local deploy tool config`.
  - `c9a45f3` - `Document Vercel deployment workflow`.
  - `5e58ad1` - `Redirect www to apex`.
  - `8d33f3c` - `Update deployment validation report`.
- Vercel account/scope: `chen-d2eb`.
- Vercel project: `oopbuyanswers`.
- Vercel project id: `prj_UniyNy1KPTUU5XXDGjoXFw5EUC7s`.
- GitHub connection: Vercel CLI `git connect` completed for `https://github.com/chongda60-art/oopbuyanswers`.
- Production deployment id: `dpl_9KNp2B6qCFejaG3EJ3cTAtZduM6a`.
- Production inspect URL: `https://vercel.com/chen-d2eb/oopbuyanswers/9KNp2B6qCFejaG3EJ3cTAtZduM6a`.
- Public Vercel alias: `https://oopbuyanswers.vercel.app`.
- Latest deployment URL: `https://oopbuyanswers-j9uha6nq0-chen-d2eb.vercel.app`.
- Vercel environment variables:
  - `NEXT_PUBLIC_LAUNCH_INDEXING=false`
  - `NEXT_PUBLIC_SITE_URL=https://oopbuyanswers.com`
  - `NEXT_PUBLIC_SITE_BRAND=Oopbuy Answers`
- Public alias checks:
  - `/`, `/questions`, `/topics`: HTTP 200 with `meta robots=noindex, nofollow`.
  - `/spreadsheet`, `/product/demo`: HTTP 404.
  - no public Hold article candidate or fixture product text detected.
- Vercel domain records returned on 2026-08-29:
  - `@` A `216.198.79.1`
  - `@` A `64.29.17.1`
  - `www` CNAME `afb45460b24bbbef.vercel-dns-017.com.`
- Spaceship DNS records added on 2026-08-29:
  - `@` A `216.198.79.1`
  - `@` A `64.29.17.1`
  - `www` CNAME `afb45460b24bbbef.vercel-dns-017.com`
  - TTL: 30 minutes.
  - Nameservers remained `launch1.spaceship.net` and `launch2.spaceship.net`.
- Vercel domain verification:
  - `oopbuyanswers.com`: `configured_correctly`, attached to project `oopbuyanswers`.
  - `www.oopbuyanswers.com`: `configured_correctly`, attached to project `oopbuyanswers`.
- Vercel certificate:
  - Certificate id: `cert_5vAAv5I2yNKPx5UTRawCNcRi`.
  - Covers `oopbuyanswers.com` and `www.oopbuyanswers.com`.
  - Auto renew: yes.
- Production HTTP/HTTPS validation on 2026-08-29:
  - `https://oopbuyanswers.com/`: HTTP 200.
  - `https://www.oopbuyanswers.com/`: HTTP 308 to `https://oopbuyanswers.com/`.
  - `/questions`, `/topics`, `/sources`, `/about`, `/contact`, `/privacy`: HTTP 200.
  - `/spreadsheet`, `/qcfinder`, `/product/demo`: HTTP 404.
  - Home meta robots: `noindex, nofollow`.
  - `robots.txt`: `User-Agent: *` and `Disallow: /`.
  - `sitemap.xml`: empty URL set while launch indexing is disabled.
- Automated verification:
  - `deploy-tools/verify.ps1`: passed with `VERIFY_OK`.
  - Log: `reports/verify-20260829-162516.log`.
- Latest post-report GitHub auto-deployment check:
  - Commit: `d1f22f1` (`Finalize domain validation and runbook`).
  - Production deployment id: `dpl_x5XpdcJpfBeYXpPFkJJnZJvLAEiQ`.
  - Production deployment URL: `https://oopbuyanswers-1z0eq0074-chen-d2eb.vercel.app`.
  - Status: Ready.
  - Final `deploy-tools/verify.ps1`: `VERIFY_OK`.

## Deployment automation

- Low-token scripts are consolidated under `deploy-tools/`.
- Default one-command dry run:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\run-all.ps1`
  - Result on 2026-08-29: `RUN_ALL_OK`.
  - Log: `reports/deploy-run-20260829-222316.log`.
- Approved production command:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\run-all.ps1 -ExecutePush -DeployVercel -VerifyVercelDomains`
- Optional production screenshot command:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\screenshots.ps1`
- DNS automation boundary:
  - `deploy-tools\dns-plan.ps1` prints required DNS records and observed DNS, and can run Vercel domain verification.
  - It does not write Spaceship DNS records or store credentials.
  - Any future DNS write automation must use verified Spaceship official API credentials kept outside Git.

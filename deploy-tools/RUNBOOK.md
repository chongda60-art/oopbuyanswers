# Oopbuy Answers deployment runbook

All scripts live under `F:\seojieliu\deploy-tools`. They read `config.psd1` when present, otherwise they fall back to `config.example.psd1`.

Do not commit `config.psd1`, `.vercel`, environment files, cookies, browser sessions, tokens, or DNS credentials.

## Default safe path

1. Copy `config.example.psd1` to `config.psd1` and set the real Git remote.
2. Run `powershell -File .\deploy-tools\preflight.ps1`.
3. Run `powershell -File .\deploy-tools\build.ps1`.
4. Run `powershell -File .\deploy-tools\deploy.ps1` for a dry run.
5. Run `powershell -File .\deploy-tools\deploy.ps1 -Execute` only for an approved Git push.
6. Run `powershell -File .\deploy-tools\deploy.ps1 -Execute -Vercel` only when a production Vercel deployment is approved.
7. After Vercel reports Ready and domains are Valid, run `powershell -File .\deploy-tools\verify.ps1`.
8. Save the output log under `reports/`.

## One-command flow

Dry run. This performs preflight, install/check/lint/build, prints git status, prints DNS requirements, and verifies the current production domain. It does not push or deploy.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\run-all.ps1
```

Approved Git push and Vercel production deployment:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\run-all.ps1 -ExecutePush -DeployVercel -VerifyVercelDomains
```

If terminal GitHub access is temporarily blocked but the reviewed local source must still deploy to Vercel, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\deploy.ps1 -Execute -SkipGitPush -Vercel
```

Then retry `git push origin HEAD` when GitHub connectivity is available.

Approved full validation with screenshots:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\run-all.ps1 -VerifyVercelDomains -CaptureScreenshots
```

Every `run-all.ps1` run writes a transcript to `reports/deploy-run-*.log`.

## Script map

- `common.ps1`: shared config, Node runtime path, curl helpers, and log path helper.
- `preflight.ps1`: project file checks, Git remote check, secret-pattern scan, and indexing guard.
- `validate-content.ps1`: validates question fixtures, CuriCart bridge fields, renderable status, max five product cards, UTM, CuriCart host, empty title/category/image prevention, and no local product routes.
- `build.ps1`: preflight, `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm lint`, and `pnpm build`.
- `deploy.ps1`: dry-run by default; with `-Execute` pushes to GitHub; with `-Vercel` also deploys production through Vercel CLI.
- `dns-plan.ps1`: prints required DNS records and observed public DNS; with `-VerifyWithVercel` runs Vercel domain verification.
- `verify.ps1`: checks production status, www redirect, noindex meta, robots, empty sitemap, required 200 pages, required 404 pages, and forbidden draft/fixture text.
- `screenshots.ps1`: captures production desktop/mobile screenshots for home and Questions.
- `run-all.ps1`: orchestrates the full flow and logs the run.

## Indexing launch gate

Keep `NEXT_PUBLIC_LAUNCH_INDEXING=false` until the first professional question page, official facts, content review, fact review, SEO review, and indexing launch are separately approved. Do not submit Search Console, Bing, IndexNow, or a sitemap before that approval.

## Reusable Buy-site content loop

For another single-Buy question site, reuse the same code path and change configuration/data only:

1. Edit `content/site.json` for brand, target agent, domain, homepage copy, footer copy, and public source language.
2. Convert the approved First 10 topic map into `content/questions.json`.
3. Keep each article to one long-tail question with `targetKeyword`, `slug`, `title`, `h1`, `quickAnswer`, `evidenceSummary`, `steps`, `mistakes`, `unknowns`, `faq`, `sources`, `relatedTopics`, `relatedQuestions`, and `curicartBridge`.
4. Use `curicartBridge` only for `productPreview` or `categoryLink`.
5. `productPreview` renders only when status or matchStatus is `approved/current`, `matchReason` is non-empty, product name, image URL, category, Style/SKU, source type, canonical CuriCart URL, UTM URL, and verified date are complete.
6. `categoryLink` renders only when status or matchStatus is `approved/current`, `matchReason` is non-empty, and the link points to a canonical CuriCart category URL with UTM.
7. UTM must stay `utm_source=oopbuyanswers`, `utm_medium=referral`, `utm_campaign=oopbuy_questions`, and `utm_content={question_slug_or_topic_slug}` unless a new approved site config explicitly changes it.
8. Do not create local product detail routes. Product and category cards must leave to CuriCart.
9. Run `powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\validate-content.ps1`, then `run-all.ps1`.
10. Keep `NEXT_PUBLIC_LAUNCH_INDEXING=false` until content, fact, SEO, and indexing launch are separately approved.

The public Bridge component is `components/CuricartBridge.tsx`. It uses horizontal card grids: desktop roughly four product cards, tablet two columns, mobile one column. Category bridge cards use the same data rules and responsive system.

## DNS rule

Use only the live records shown in the Vercel domain screen. Do not store DNS credentials, cookies, or tokens in this directory. Do not delete mail or unrelated records. Apex is the primary host; `www` must redirect permanently to the apex.

Records applied in Spaceship on 2026-08-29 for `oopbuyanswers.com`:

- `@` A `216.198.79.1`
- `@` A `64.29.17.1`
- `www` CNAME `afb45460b24bbbef.vercel-dns-017.com`
- TTL: 30 minutes.

Vercel verification after the Spaceship update:

- `oopbuyanswers.com`: `configured_correctly`.
- `www.oopbuyanswers.com`: `configured_correctly`.
- Certificate issued by Vercel for both hosts with auto-renew enabled.

Future DNS automation can be added only against Spaceship's official API after API credentials and endpoint behavior are verified. Keep any API key/secret in local environment variables or an ignored local config file. Never commit DNS credentials, cookies, or browser session data.

## Rollback

Revert the deployment commit in Git and push. Vercel will redeploy the previous state. DNS should not be changed for an application rollback.

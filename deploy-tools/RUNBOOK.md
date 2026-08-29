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

Approved full validation with screenshots:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\deploy-tools\run-all.ps1 -VerifyVercelDomains -CaptureScreenshots
```

Every `run-all.ps1` run writes a transcript to `reports/deploy-run-*.log`.

## Script map

- `common.ps1`: shared config, Node runtime path, curl helpers, and log path helper.
- `preflight.ps1`: project file checks, Git remote check, secret-pattern scan, and indexing guard.
- `build.ps1`: preflight, `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm lint`, and `pnpm build`.
- `deploy.ps1`: dry-run by default; with `-Execute` pushes to GitHub; with `-Vercel` also deploys production through Vercel CLI.
- `dns-plan.ps1`: prints required DNS records and observed public DNS; with `-VerifyWithVercel` runs Vercel domain verification.
- `verify.ps1`: checks production status, www redirect, noindex meta, robots, empty sitemap, required 200 pages, required 404 pages, and forbidden draft/fixture text.
- `screenshots.ps1`: captures production desktop/mobile screenshots for home and Questions.
- `run-all.ps1`: orchestrates the full flow and logs the run.

## Indexing launch gate

Keep `NEXT_PUBLIC_LAUNCH_INDEXING=false` until the first professional question page, official facts, content review, fact review, SEO review, and indexing launch are separately approved. Do not submit Search Console, Bing, IndexNow, or a sitemap before that approval.

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

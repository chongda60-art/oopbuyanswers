# Oopbuy Answers deployment runbook

## Default safe path

1. Copy `config.example.psd1` to `config.psd1` and set the real Git remote.
2. Run `powershell -File .\deploy-tools\preflight.ps1`.
3. Run `powershell -File .\deploy-tools\build.ps1`.
4. Run `powershell -File .\deploy-tools\deploy.ps1` for a dry run.
5. Run `powershell -File .\deploy-tools\deploy.ps1 -Execute` only for an approved Git push.
6. Run `powershell -File .\deploy-tools\deploy.ps1 -Execute -Vercel` only when a production Vercel deployment is approved.
7. After Vercel reports Ready and domains are Valid, run `powershell -File .\deploy-tools\verify.ps1`.
8. Save the output log under `reports/`.

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

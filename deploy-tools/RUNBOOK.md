# Oopbuy Answers deployment runbook

## Default safe path

1. Copy `config.example.psd1` to `config.psd1` and set the real Git remote.
2. Run `powershell -File .\deploy-tools\preflight.ps1`.
3. Run `powershell -File .\deploy-tools\build.ps1`.
4. Run `powershell -File .\deploy-tools\deploy.ps1` for a dry run.
5. Run `powershell -File .\deploy-tools\deploy.ps1 -Execute` only for an approved Git push.
6. Run `powershell -File .\deploy-tools\deploy.ps1 -Execute -Vercel` only when a production Vercel deployment is approved.
7. After Vercel reports Ready and domains are Valid, run `powershell -File .\deploy-tools\verify.ps1`.

## Indexing launch gate

Keep `NEXT_PUBLIC_LAUNCH_INDEXING=false` until the first professional question page, official facts, content review, fact review, SEO review, and indexing launch are separately approved. Do not submit Search Console, Bing, IndexNow, or a sitemap before that approval.

## DNS rule

Use only the live records shown in the Vercel domain screen. Do not store DNS credentials, cookies, or tokens in this directory. Do not delete mail or unrelated records. Apex is the primary host; `www` must redirect permanently to the apex.

Records returned by Vercel on 2026-08-29 for `oopbuyanswers.com`:

- `@` A `216.198.79.1`
- `@` A `64.29.17.1`
- `www` CNAME `afb45460b24bbbef.vercel-dns-017.com.`

Current Spaceship DNS before the update had `@` A `54.149.79.189` and `@` A `34.216.117.25`. Replace those apex parking/application records only if they are still present. Do not change mail or unrelated records.

## Rollback

Revert the deployment commit in Git and push. Vercel will redeploy the previous state. DNS should not be changed for an application rollback.

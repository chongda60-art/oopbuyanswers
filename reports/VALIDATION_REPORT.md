# Oopbuy Answers validation report

Status: implementation, local validation, GitHub push, and Vercel production deployment complete. Custom-domain DNS is pending Spaceship record update.

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

## Production

- Git repository: `https://github.com/chongda60-art/oopbuyanswers`.
- Commits:
  - `bb1581f` - `Build Oopbuy Answers prelaunch research site`.
  - `149e00e` - `Ignore local deploy tool config`.
  - `c9a45f3` - `Document Vercel deployment workflow`.
  - `5e58ad1` - `Redirect www to apex`.
- Vercel account/scope: `chen-d2eb`.
- Vercel project: `oopbuyanswers`.
- Vercel project id: `prj_UniyNy1KPTUU5XXDGjoXFw5EUC7s`.
- GitHub connection: Vercel CLI `git connect` completed for `https://github.com/chongda60-art/oopbuyanswers`.
- Production deployment id: `dpl_2EteUNgMtCLA87wwGtcYQT4DAsS8`.
- Production inspect URL: `https://vercel.com/chen-d2eb/oopbuyanswers/2EteUNgMtCLA87wwGtcYQT4DAsS8`.
- Public Vercel alias: `https://oopbuyanswers.vercel.app`.
- Latest deployment URL: `https://oopbuyanswers-401g4bckf-chen-d2eb.vercel.app`.
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
- Current DNS observed by Vercel before Spaceship update:
  - nameservers: `launch1.spaceship.net`, `launch2.spaceship.net`
  - apex A: `54.149.79.189`, `34.216.117.25`
  - www CNAME: none
- Custom domain status: pending Spaceship DNS update and propagation.
- HTTPS/apex/www redirect: pending DNS update.

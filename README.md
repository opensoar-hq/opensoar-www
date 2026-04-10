# OpenSOAR Website

Landing page for the OpenSOAR project at [opensoar.app](https://opensoar.app).

**OpenSOAR is a PwnKit Labs product.**

## Tech Stack

- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)

## Development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

## Build

```bash
npm run build
```

Output is written to `./dist/`.

## Analytics

GA4 is optional and can be enabled with a public env var:

```bash
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Set that in Cloudflare Pages environment variables for production, then redeploy.

## Search Console

Google Search Console can be verified in either of two ways:

```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=your-meta-tag-token
```

That emits the verification meta tag in the site layout.

If you prefer the HTML file method, set:

```bash
GOOGLE_SITE_VERIFICATION=google1234567890abcdef.html
```

That generates the expected verification file at the site root during build.

The sitemap to submit is:

```text
https://opensoar.app/sitemap-index.xml
```

## Deployment

Deployed automatically via Cloudflare Pages on push to `main`.

## Part of OpenSOAR

- [opensoar-core](https://github.com/opensoar-hq/opensoar-core) — Core platform (API, UI, playbook engine)
- [opensoar-sdk](https://github.com/opensoar-hq/opensoar-sdk) — Python SDK
- [opensoar-integrations](https://github.com/opensoar-hq/opensoar-integrations) — Community integrations

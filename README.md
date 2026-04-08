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

## Deployment

Deployed automatically via Cloudflare Pages on push to `main`.

## Part of OpenSOAR

- [opensoar-core](https://github.com/opensoar-hq/opensoar-core) — Core platform (API, UI, playbook engine)
- [opensoar-sdk](https://github.com/opensoar-hq/opensoar-sdk) — Python SDK
- [opensoar-integrations](https://github.com/opensoar-hq/opensoar-integrations) — Community integrations

import { getCollection } from 'astro:content';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';

type BreadcrumbItem = {
  name: string;
  url: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type SitemapEntry = {
  loc: string;
  lastmod: string;
};

type SourceEntry = {
  loc: string;
  source: string;
};

const staticEntries: SourceEntry[] = [
  { loc: 'https://opensoar.app/', source: resolve(process.cwd(), 'src/pages/index.astro') },
  { loc: 'https://opensoar.app/ai-triage/', source: resolve(process.cwd(), 'src/pages/ai-triage.astro') },
  { loc: 'https://opensoar.app/blog/', source: resolve(process.cwd(), 'src/pages/blog.astro') },
  { loc: 'https://opensoar.app/compare/', source: resolve(process.cwd(), 'src/pages/compare.astro') },
  { loc: 'https://opensoar.app/getting-started/', source: resolve(process.cwd(), 'src/pages/getting-started.astro') },
  { loc: 'https://opensoar.app/guides/', source: resolve(process.cwd(), 'src/pages/guides.astro') },
  { loc: 'https://opensoar.app/integrations/', source: resolve(process.cwd(), 'src/pages/integrations.astro') },
  { loc: 'https://opensoar.app/stack/', source: resolve(process.cwd(), 'src/pages/stack.astro') },
  { loc: 'https://opensoar.app/use-cases/alert-triage/', source: resolve(process.cwd(), 'src/pages/use-cases/alert-triage.astro') },
  { loc: 'https://opensoar.app/use-cases/incident-response/', source: resolve(process.cwd(), 'src/pages/use-cases/incident-response.astro') },
  { loc: 'https://opensoar.app/use-cases/mssp/', source: resolve(process.cwd(), 'src/pages/use-cases/mssp.astro') },
];

async function toLastmod(source: string): Promise<string> {
  const metadata = await stat(source);
  return metadata.mtime.toISOString();
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  for (const entry of staticEntries) {
    entries.push({
      loc: entry.loc,
      lastmod: await toLastmod(entry.source),
    });
  }

  const [guides, blogPosts, alternatives] = await Promise.all([
    getCollection('guides'),
    getCollection('blog'),
    getCollection('alternatives'),
  ]);

  for (const guide of guides) {
    const slug = guide.data.slug ?? guide.id;
    entries.push({
      loc: `https://opensoar.app/guides/${slug}/`,
      lastmod: await toLastmod(resolve(process.cwd(), `src/content/guides/${guide.id}.md`)),
    });
  }

  for (const post of blogPosts) {
    const slug = post.data.slug ?? post.id;
    entries.push({
      loc: `https://opensoar.app/blog/${slug}/`,
      lastmod: await toLastmod(resolve(process.cwd(), `src/content/blog/${post.id}.md`)),
    });
  }

  for (const alternative of alternatives) {
    const slug = alternative.data.slug ?? alternative.id;
    entries.push({
      loc: `https://opensoar.app/alternatives/${slug}/`,
      lastmod: await toLastmod(resolve(process.cwd(), `src/content/alternatives/${alternative.id}.md`)),
    });
  }

  return entries.sort((a, b) => a.loc.localeCompare(b.loc));
}

export function buildBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqStructuredData(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => `<url><loc>${entry.loc}</loc><lastmod>${entry.lastmod}</lastmod></url>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function buildSitemapIndexXml(): string {
  return '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://opensoar.app/sitemap-0.xml</loc></sitemap></sitemapindex>';
}

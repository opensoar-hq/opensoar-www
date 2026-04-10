import { buildSitemapXml, getSitemapEntries } from '../utils/seo';

export async function GET() {
  const entries = await getSitemapEntries();

  return new Response(buildSitemapXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

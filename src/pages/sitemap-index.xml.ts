import { buildSitemapIndexXml } from '../utils/seo';

export function GET() {
  return new Response(buildSitemapIndexXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

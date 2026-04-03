import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const items = posts
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      link: `/blog/${post.data.slug ?? post.id}/`,
    }));

  return rss({
    title: 'OpenSOAR Blog',
    description: 'Security automation, open-source SOAR, and AI-assisted operations.',
    site: context.site,
    items,
    customData: '<language>en-us</language>',
  });
}

import { getCollection } from 'astro:content';
import { renderOgImage } from '../../../utils/og';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.data.slug ?? post.id },
    props: { post },
  }));
}

export function GET({ props }) {
  const { post } = props;
  return new Response(
    renderOgImage({
      eyebrow: `OpenSOAR Blog · ${post.data.category}`,
      title: post.data.heading,
      description: post.data.description,
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  );
}

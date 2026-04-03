import { getCollection } from 'astro:content';
import { renderOgImage } from '../../../utils/og';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides.map((guide) => ({
    params: { slug: guide.data.slug ?? guide.id },
    props: { guide },
  }));
}

export function GET({ props }) {
  const { guide } = props;
  return new Response(
    renderOgImage({
      eyebrow: 'OpenSOAR Guide',
      title: guide.data.heading,
      description: guide.data.description,
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  );
}

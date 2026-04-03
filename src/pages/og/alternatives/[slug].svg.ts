import { getCollection } from 'astro:content';
import { renderOgImage } from '../../../utils/og';

export async function getStaticPaths() {
  const alternatives = await getCollection('alternatives');
  return alternatives.map((alternative) => ({
    params: { slug: alternative.data.slug ?? alternative.id },
    props: { alternative },
  }));
}

export function GET({ props }) {
  const { alternative } = props;
  return new Response(
    renderOgImage({
      eyebrow: 'OpenSOAR Alternative',
      title: alternative.data.heading,
      description: alternative.data.description,
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  );
}

import { renderOgImage } from '../../utils/og';

export function GET() {
  return new Response(
    renderOgImage({
      eyebrow: 'OpenSOAR',
      title: 'Alert-to-response automation in Python',
      description: 'Open-source security automation, playbooks, guides, and docs.',
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  );
}

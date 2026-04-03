// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://opensoar.app',
  integrations: [react(), sitemap()],
  redirects: {
    '/python-security-playbooks': '/guides/python-security-playbooks',
    '/security-automation': '/guides/security-automation',
    '/what-is-soar': '/guides/what-is-soar',
  },

  vite: {
    plugins: [tailwindcss()]
  },
});

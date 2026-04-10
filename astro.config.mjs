// @ts-check
import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

function googleVerification() {
  return {
    name: 'google-verification-file',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const verificationName = process.env.GOOGLE_SITE_VERIFICATION?.trim();
        if (!verificationName) {
          return;
        }

        const fileName = verificationName.endsWith('.html')
          ? verificationName
          : `${verificationName}.html`;
        const targetPath = join(dir.pathname, fileName);
        await writeFile(targetPath, `google-site-verification: ${fileName}`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://opensoar.app',
  integrations: [react(), googleVerification()],
  redirects: {
    '/python-security-playbooks': '/guides/python-security-playbooks',
    '/security-automation': '/guides/security-automation',
    '/what-is-soar': '/guides/what-is-soar',
  },

  vite: {
    plugins: [tailwindcss()]
  },
});

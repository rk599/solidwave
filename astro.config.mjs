import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: "static",
  adapter: vercel({
    webAnalytics: { enabled: false },
  }),
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});

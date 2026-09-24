// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amireyzed.com',
  output: 'static',
  // Keep classic whitespace handling so spaces between inline elements survive (Astro 7 default is "jsx").
  compressHTML: true,
  // Hide the dev toolbar so the local preview looks exactly like production.
  devToolbar: { enabled: false },
  i18n: {
    defaultLocale: 'fa',
    locales: ['fa', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fa',
        locales: { fa: 'fa-IR', en: 'en-US' },
      },
    }),
  ],
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kevinstevbayer.github.io',
  base: '/portfolio-astra',
  output: 'static',
  compressHTML: 'jsx',
  trailingSlash: 'always',
  integrations: [sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
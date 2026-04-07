// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // SSR mode — required for CSPT research
  adapter: node({ mode: 'standalone' }),
  vite: {
    build: {
      sourcemap: true,
    },
  },
});

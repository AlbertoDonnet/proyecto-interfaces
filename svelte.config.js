import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/nombre-del-repo' : ''
    },
    appDir: 'internal'
  }
};

export default config;
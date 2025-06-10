import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // Necesario para el manejo de rutas
      precompress: false
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/proyecto-interfaces' : '',
      relative: false
    },
    appDir: 'internal',
    prerender: {
      entries: [
        '/',
        '/graficos'
      ]
    }
  }
};

export default config;
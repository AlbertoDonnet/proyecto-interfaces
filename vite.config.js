
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/////////////// SE ENCARGA VITE DE ESTO
// Determina la base path para Vite
//let vite_base_path = '/'; // Por defecto para desarrollo

// Si estamos en un build de producción O en modo de previsualización de la build de producción
//if (process.env.NODE_ENV === 'production' || process.env.VITE_PREVIEW_MODE === 'true') {
//  vite_base_path = '/proyecto-interfaces/'; // La base para GitHub Pages
//}
//----------------------------------------------------------------------------------------------


export default defineConfig({
  //  base: vite_base_path, // En build se encarga vite automáticamente
  plugins: [sveltekit()],
  build: {
    sourcemap: true
  }

});
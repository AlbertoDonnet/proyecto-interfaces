// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'; // Solo necesitamos este import para PWA

export default defineConfig({
    plugins: [
        sveltekit(),
        SvelteKitPWA({
            // Esto configura los parámetros básicos de la PWA
            manifest: {
                name: 'Mi App de Cálculo y Gráficos',
                short_name: 'Calculadora',
                description: 'Visualizador de Superficies 3D y Cálculos con SvelteKit',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                // Estas son las estrategias de caché.
                // Asegurarse de que los archivos estáticos y las páginas se cacheen correctamente.
                
                globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            },
            // Asegurarse de registrar el service worker
            registerType: 'autoUpdate',
            // Para desarrollo, puedes desactivarlo si te causa problemas,
            // pero para producción, asegúrate de que esté en true
            devOptions: {
                enabled: true
            },
            // Ruta del service worker
            srcDir: './src',
            strategies: 'generateSW',
        }),
    ],

    // La opción 'build.target: esnext' no es estrictamente necesaria sin WASM
    // pero no debería causar problemas si la dejas.
    // build: {
    //     target: 'esnext'
    // }
});
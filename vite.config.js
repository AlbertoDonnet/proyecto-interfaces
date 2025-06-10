import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
    plugins: [
        sveltekit(),
        SvelteKitPWA({
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
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
            },
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            srcDir: './src',
            strategies: 'generateSW',
        }),
    ],
});

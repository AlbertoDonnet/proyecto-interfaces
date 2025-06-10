const CACHE_NAME = 'calculadora-v1';

// Importa la lista generada automáticamente como una variable global en el scope del service worker
importScripts('./service-worker-cache-list.js'); 
// Este archivo debe definir: self.urlsToCache = [...] (NO export)

// Agrega manualmente recursos que deben estar sí o sí cacheados
const manualCache = [
  './',
  './graficos',
  './manifest.webmanifest',
  './offline.html',
  './pwa-192x192.png',
  './pwa-512x512.png',
  
  // Agrega aquí rutas de páginas que quieras cachear (aunque no sean archivos estáticos)
  './about',
  './contacto',
  './otra-ruta',
];

// Combina ambas listas (manual + generada dinámicamente)
const urlsToCache = Array.from(new Set([...manualCache, ...self.urlsToCache]));

// Evento install: abre el cache y guarda los recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache abierto y precargando archivos...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento activate: limpia caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Evento fetch: responde con cache, o fetch, y cachea nuevo recurso
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cachear solo http/https
        try {
          const url = new URL(event.request.url);
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache).catch(err => {
                console.warn('Error al cachear:', err);
              });
            });
          }
        } catch (e) {
          console.warn('Request no cacheable:', event.request.url);
        }

        return networkResponse;
      });

    }).catch(() => {
      // Si es navegación y falla, responder con offline.html
      if (event.request.mode === 'navigate') {
        return caches.match('./offline.html');
      }
      return new Response('', { status: 503, statusText: 'Offline' });
    })
  );
});

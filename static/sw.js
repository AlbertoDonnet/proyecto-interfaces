const CACHE_NAME = 'calculadora-v1';
const APP_BASE_PATH = '/proyecto-interfaces';

// Intenta cargar la lista de caché, pero no falles si no existe
try {
  importScripts(`${APP_BASE_PATH}/service-worker-cache-list.js`);
} catch (e) {
  console.warn('No se pudo cargar service-worker-cache-list.js', e);
  self.urlsToCache = [];
}

// Agrega manualmente recursos que deben estar sí o sí cacheados
const manualCache = [
  './',
  './manifest.webmanifest',
  './offline.html',
  './pwa-192x192.png',
  './pwa-512x512.png',
];

// Combina ambas listas (manual + generada dinámicamente)
const combinedUrlsToCache = Array.isArray(self.urlsToCache) ? self.urlsToCache : [];
const urlsToCache = Array.from(new Set([...manualCache, ...combinedUrlsToCache]));

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
      // ESTA ES LA PARTE CRÍTICA: responde con './' si es navegación
      if (event.request.mode === 'navigate') {
        return caches.match('./');
      }
      return caches.match('./offline.html') || new Response('', { status: 503, statusText: 'Offline' });
    })
  );
});


const CACHE_NAME = 'blood-academy-v6';

// Get the base path where the app is served
const getBasePath = () => {
  const scope = self.registration ? self.registration.scope : '/';
  return new URL(scope).pathname;
};

// Install - cache the essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const basePath = getBasePath();
      // Use relative URLs that work with the current path
      const urlsToCache = [
        basePath,
        basePath + 'index.html',
        basePath + 'manifest.json'
      ];
      console.log('[SW] Caching:', urlsToCache);
      return cache.addAll(urlsToCache);
    }).then(() => {
      console.log('[SW] Install complete');
      return self.skipWaiting();
    }).catch((err) => {
      console.error('[SW] Install error:', err);
    })
  );
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      console.log('[SW] Activated, claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch - serve from cache first
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  if (request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cached) => {
        if (cached) {
          console.log('[SW] Cache hit:', request.url);
          return cached;
        }
        
        // Try network
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          console.log('[SW] Network failed:', request.url);
          
          // For navigation, return index.html
          if (request.mode === 'navigate') {
            const basePath = getBasePath();
            return cache.match(basePath + 'index.html').then((r) => {
              if (r) return r;
              return cache.match(basePath).then((r2) => {
                if (r2) return r2;
                // Try with trailing slash
                return cache.match(basePath.replace(/\/$/, '') + '/').then((r3) => {
                  if (r3) return r3;
                  throw new Error('No cached fallback');
                });
              });
            });
          }
          
          throw new Error('Network failed and no cache');
        });
      });
    }).catch((err) => {
      console.error('[SW] Fetch error:', err);
      return new Response('Offline - please try again when connected', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

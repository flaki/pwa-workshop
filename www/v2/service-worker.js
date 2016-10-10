importScripts('sw-shell.js');
importScripts('sw-dynamic.js');


self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');

  // Automatically activate after installation, do not wait for reload
  event.waitUntil(self.skipWaiting());
});

// activate event
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
});

// respond from cache
self.addEventListener('fetch', event => {
  // Try without this line - POST request caching is unsupported!
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          let intoCache = response.clone();
          caches.open(C_DYNAMIC).then(cache => cache.put(event.request, intoCache));
          return response;
        })
        .catch(ex => caches.match(event.request))
    );
  }
});

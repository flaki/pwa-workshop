importScripts('sw-shell.js');
importScripts('sw-dynamic.js');


self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');

  // Automatically activate after installation, do not wait for reload
  e.waitUntil(self.skipWaiting());
});

// activate event
self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate');
});

// respond from cache
self.addEventListener('fetch', function(event) {
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

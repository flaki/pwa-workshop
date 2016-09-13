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
      caches.match(event.request)
        .then(response => {
          if (response) return response;

          return fetch(event.request)
            .then(fetchResult => {
              caches.open(C_DYNAMIC).then(cache => cache.put(event.request, fetchResult.clone()));
              return fetchResult;
            });
        })
    );
  }
});

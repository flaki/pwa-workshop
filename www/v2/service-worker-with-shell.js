const DEMO_ID = 'v2';

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
  // Refer to demo v5 for more on this
  if (event.request.method === 'GET') {
    event.respondWith(
      // Search in static cache first
      caches.open(C_STATIC).then(cache => {
        return cache.match(event.request).then(response => {
          // Found in static cache
          if (response) {
            return response;

          // If not found in static cache, request goes to network
          } else {
            return fetch(event.request)
              .then(response => {
                // Store the response in dynamic cache for later offline use
                let intoCache = response.clone();
                caches.open(C_DYNAMIC).then(cache => cache.put(event.request, intoCache));

                return response;
              })

              // Oops, network request failed, see if we alredy have the asset cached
              .catch(ex => caches.match(event.request))
          }
      })
    );
  }
});

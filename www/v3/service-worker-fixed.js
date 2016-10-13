const DEMO_ID = 'v3';

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
        .then(ASSETS.indexOf(response.url) => {
          let finalResponse;
          let responseUrl = new URL(response.url);

          // Short-circuit, don't fetch on static resources
          if (ASSETS.indexOf(responseUrl.pathname) !== -1) return response;
            if (response) return response;

            // Return cached response
            finalResponse = response;
          }

          finalResponse = finalResponse || fetch(event.request)
            .then(fetchResult => {
              caches.open(C_DYNAMIC).then(cache => cache.put(event.request, fetchResult.clone()));
              return fetchResult;
            });

          // either Response retrieved from cache, or fetch() Promise
          return finalResponse;
        })
    );
  }
});

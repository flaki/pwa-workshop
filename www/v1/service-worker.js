importScripts('sw-shell.js');


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
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

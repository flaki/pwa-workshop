importScripts('sw-shell.js');


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
self.addEventListener('fetch', e => {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

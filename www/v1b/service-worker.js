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

// push messages!
self.addEventListener('push', event => {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    self.registration.showNotification('Empire TODO', {
      body: 'It\'s over, Commander.\nThe rebels have been routed and they\'re fleeing into the woods.',
    })
  );
});

const C_DYNAMIC = 'cDynamic-'+DEMO_ID;


self.addEventListener('install', event => {
  // Reinitialize dynamic cache
  event.waitUntil(
    caches.delete(C_DYNAMIC).then(
      caches.open.bind(caches, C_DYNAMIC)
    ).then(cache => {
      console.log('[ServiceWorker] Dynamic cache initialized');
    })
  );
});

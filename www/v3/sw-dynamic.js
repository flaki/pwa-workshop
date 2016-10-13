const C_DYNAMIC = 'cDynamic-'+DEMO_ID;


self.addEventListener('install', e => {
  // Reinitialize dynamic cache
  e.waitUntil(
    caches.delete(C_DYNAMIC).then(
      caches.open.bind(caches, C_DYNAMIC)
    ).then(cache => {
      console.log('[ServiceWorker] Dynamic cache initialized');
    })
  );
});

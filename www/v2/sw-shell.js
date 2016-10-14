const C_SHELL = 'cShell-'+DEMO_ID;


const ASSETS = [
  '/favicon.ico',
  '/img/bg.jpg',
  '/img/logo.png',
  '/img/logo-small.png',
  '/img/logo-w.png',
  '/img/logo-w-small.png',
  '/lib/whatwg-fetch/fetch.js',
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/sw.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(C_SHELL).then((cache) => {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(ASSETS);
    })
  );
});

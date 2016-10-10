const C_SHELL = "cShell";


const ASSETS = [
  "/favicon.ico",
  "/img/bg.jpg",
  "/img/logo.png",
  "/img/logo-small.png",
  "/img/logo-w.png",
  "/img/logo-w-small.png",
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(C_SHELL).then((cache) => {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(ASSETS);
    })
  );
});

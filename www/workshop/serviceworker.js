console.log("Service worker script loaded.");

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

self.addEventListener('install', function() {
  console.log('Installing service worker...');
  //event.waitUntil()
  caches.open('workshopCache').then(cache => {
    console.log('Caching assets in workshopCache');
    if (cache) {
      cache.addAll(ASSETS);
    }
  });
});

//self.addEventListener('fetch', function(event) {})
  self.addEventListener('fetch', event => {
    console.log('Fetch: ', event.request.url);

    //event.respondWith(new Request({ body: 'Hello!' }));
    let cacheResponsePromise = caches.match(event.request).then(response => {
      console.log(event.request.url, ( response ? "FOUND" : "NOT CACHED" ), response);
      return response||fetch(event.request);
    });
    event.respondWith(cacheResponsePromise);
  });

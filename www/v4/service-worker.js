const DEMO_ID = 'v4';

importScripts('sw-shell.js');
importScripts('sw-dynamic.js');

importScripts('/lib/idb-keyval/dist/idb-keyval-min.js');


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

    // If this is an API request, go network-first
    let requestUrl = new URL(event.request.url);
    let endpoint = requestUrl.pathname.match(/^\/api\/(\w+)/);
    if (endpoint) {
      endpoint = endpoint[1];
      console.log('API request to ['+endpoint+']', requestUrl.pathname);

      event.respondWith(
        // network request successful, got new, fresh data
        fetch(event.request).then(response => {
          // cache it
          let cacheResponse = response.clone();
          caches.open(C_DYNAMIC).then(cache => cache.put(event.request, cacheResponse));

          // process it
          let dataResponse = response.clone();
          dataResponse.json().then(responseData => {
            console.log(responseData);

            // Load/create persisted data
            idbKeyval.get(endpoint)
              .catch(_ => ({}))
              .then(storeData => {
                storeData = storeData||{};

                // Overwrite updated elements with newly received ones
                responseData.forEach(d => {
                  storeData[d.id] = d
                });

                // Persist updated data
                idbKeyval.set(endpoint, storeData);
              })
          });

          // return the response
          return response;
        })

        // failed to fetch
        .catch(err => {
          // return synthetic search for note search
          if (requestUrl.pathname === '/api/notes/search') {
            let query = new URL(requestUrl).searchParams.get('q');
            console.log('Performing offline search from cache: "'+query+'"');

            return idbKeyval.get('notes').then(notes => {
              // Execute rudimentary search
              let result = [];
              let sparam = new RegExp(query||'.*', 'i');

              for (let l in notes) if (notes.hasOwnProperty(l)) {
                if (notes[l].title.match(sparam)||notes[l].contents.match(sparam)) result.push(notes[l]);
              }
              console.log("Offline search found ", result.length, "results.");

              // Return by mimicing API JSON response
              return new Response(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' }
              });
            });
          }

          // return cached data for the rest
          return caches.match(event.request);
        })
      );

    } else {
      let requestPathname = new URL(event.request.url)
        .pathname
        .replace(new RegExp('^\\/'+DEMO_ID), '.'); // relative urls

      event.respondWith(
        caches.match(event.request).then(response => {
          let finalResponse;

          // Short-circuit, don't fetch on static resources
          console.log('cache details: ', requestPathname, response, ASSETS.indexOf(requestPathname));
          if (ASSETS.indexOf(requestPathname) !== -1) {
            console.log('cached', response)
            if (response) return response;

            // Cached response (or null if not found in cache)
            finalResponse = response;
          }

          // Return cached response, or fetch & cache request (if not matched yet)
          finalResponse = finalResponse || fetch(event.request)
            .then(fetchResult => {
              caches.open(C_DYNAMIC).then(cache => cache.put(event.request, fetchResult.clone()));
              return fetchResult;
            });

          // either Response retrieved from cache, or fetch() Promise
          return finalResponse;
        })
      )
    }
  }
});

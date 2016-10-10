if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(reg => {
      console.log('Service Worker installed.');
    },
    err => {
      console.log('Oops, Service Worker installation failed!', err);
  });
}

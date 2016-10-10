if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(reg => {
      console.log('Service Worker installed.');

      return reg;
    },
    err => {
      console.log('Oops, Service Worker installation failed!', err);
  })

  // Push notifications setup
  .then(registration => {
    // Use the PushManager to get the user's subscription to the push service.
    return registration.pushManager.getSubscription()
      .then(function(subscription) {
        // If a subscription was found, return it.
        if (subscription) {
          return subscription;
        }

        // Otherwise create new subscription subscribe
        return registration.pushManager.subscribe({ userVisibleOnly: true });
      });
  })

  // We've got a subscription object yay!
  .then(function(subscription) {
    endpoint = subscription.endpoint;
    console.log('Push endpoint is: ', endpoint);

    // Send the subscription details to the server using the Fetch API.
    fetch('/api/push/register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });
  });

}

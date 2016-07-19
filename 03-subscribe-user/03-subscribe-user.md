# Subscribing a User

The very first step towards sending your users push messages is to get them
to subscribe for push messages.

For the most part this just means getting permission from the user that they
want to receive push messages from you. The browser will also manage signing
the user up with a push service which will manage the sending of push messages
to that browser.

## Feature Detection



## Register a Service Worker

Push messaging on the web requires a service worker to work, so the first
thing to do is register a servier worker.

    navigator.serviceWorker.register('/path/to/serviceworker.js')
    .then(registration => {
      console.log('Successfully registered the service worker.');
    })
    .catch(err => {
      console.error('Unable to register service worker', err);  
    });

This code tells the browser that you have a service worker file and where
its located, in this case `/path/to/serviceworker.js`. Behind the scenes
the browser will fetch your service worker file, run it and if everything
went well, the promise it returns will resolve, if there was an error of
any kind, the promise rejects. Common reasons for the promise to reject are
the script couldn't be downloaded by the browser or the script has errors in it.

When `register()` resolves, it returns a `ServiceWorkerRegistration` which
has the `PushManager` API on it.

## Subscribe a User with PushManager

Using your new service worker registration, we can subscribe a user
for push by calling `subscribe()` on your push manager.

    function subscribeUserForPush(registration) {
      return registration.pushManager.subscribe()
      ,then(subscription => {
          console.log('User subscribe for push messaging', subscription);
      })
      .catch(err => {
          console.error('Unable to subscribe user for push', err);
      });
    }


When you call `subscribe()`, if your site doesn't already have permissions
to show notifications, the browser will request permission from the user
and if granted, it'll "subscribe" the user with a push service.

Subscribing a user to a push service ultimately means getting an ID for that
user on a push service.

// No control on push service, browser choice
// All use web push protocol

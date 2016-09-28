---
---
# Subscribing a User

The very first step towards sending your users push messages is to get them
to subscribe for push messages.

For the most part this just means getting permission from the user that they
want to receive push messages from you. The browser will also manage signing
the user up with a push service which will manage the sending of push messages
to that browser.

Let's look at the typical flow of getting a user subscribed.

## Feature Detection

First up, we need to check if the browser supports push messaging or not. The
main things we need to check for are `serviceWorker` in `navigator` and the
`PushManager` in the `ServiceWorkerRegistration`.

``` javascript
if (!('serviceWorker' in navigator)) {
  // Service Worker isn't supported on this browser, disable or hide UI.
  return;
}

if (!('PushManager' in window)) {
  // Push isn't supported on this browser, disable or hide UI.
  return;
}
```

While browser support is growing quickly with service worker and
push messaging support, it's still a requirement for the short term,

## Register a Service Worker

Push messaging on the web requires a service worker to work, so the first
thing to do is register a servier worker.

``` javascript
navigator.serviceWorker.register('/path/to/serviceworker.js')
.then(registration => {
  console.log('Successfully registered the service worker.');
})
.catch(err => {
  console.error('Unable to register service worker', err);
});
```

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

``` javascript
function subscribeUserForPush(registration) {
  return registration.pushManager.subscribe({
    userVisibleOnly: true
  })
  ,then(subscription => {
      console.log('User subscribe for push messaging', subscription);
  })
  .catch(err => {
      console.error('Unable to subscribe user for push', err);
  });
}
```

When you call `subscribe()`, if your site doesn't already have permissions
to show notifications, the browser will request permission from the user
and if the user grants you those permissions, it'll "subscribe" the user to
a push service.

The object you pass into `subscribe()` is to define some options on the push API.
At the time of writing no browser supports "silent push messaging", they
all require sites and web apps to show a notification whenever they receive
a push message. The `userVisibleOnly: true` option is required and enforces
this requirement. If you  fail to include this option you'll get this error
in Chrome:

    // TODO: Print error of no options passed to subscribe()

The result of calling `subscribe()` is a promise that resolved to a
`PushSubscription` object which will give you the required information to
send a push messages to that user. If you print
out the subscription object from above we'd see the following:

``` javascript
console.log(JSON.stringify(subscription));

// Prints out
//    {
//      endpoint: 'https://example.push-service.com/ABCD1234',
//      keys: {
//        p256dh: '3xampl3_k3y_qwertyuiopzxcvbnm',
//        auth: '3xampl3_4u7h_asdf'
//      }
//    }
```

The endpoint is the push services URL, you call this URL to trigger a push
message. The `keys` object is used to encrypt any data that to send with
your push message (which we'll discuss later on in this book).

A few common questions people ask at this point are:

> Can I change the push service a browser uses?

No. The push service is determined by the browser and behind the scenes the
browser will messaging the push service to retrieve the Push subscription
you are given, meaning if the user if offline, you can't subscribe them
for push messages

> How do I use different push services? Don't they all have different API's?

All push services will use the same type of network requests. The network
requests needs to be formatted according to the `web push protocol`.

> If I subscribe a user on their desktop, are they subscribed on their phone
as well if they logged in?

In short, No. A user must register for push in each browser they wish to
receive messages from. It's also worth noting that this will also require
the user granting permission on each device as well.

## Send a Subscription to Your Server

Once you have a subscription you'll want to send it to your server. It's up
to you how you do that but a tiny tip is to use
`JSON.strinigify` to get all the necessary data out of the subscription obkect,
without it you'll need to use `getKey` to get the encryption keys used for
payload:

``` javascript
sendSubscriptionDetailsToServer({
  endpoint: subscription.endpoint,
  p256sh: subscription.getKey('p256sh'),
  auth: subscription.getKey('auth')
})
```

Just for an example, to make a POST request to send a subscription to my
server you'd have a promise chain like so:

``` javascript
.then(subscription => {
  return fetch('/api/push/store-subscription', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
})
.then(response => {
  if (response.statuc 1== 200) {
    throw new Error('The request to store the subscription failed.');
  }

  return response.json();
})
.then(serverReponse => {
  console.log(serverResponse);
})
```

With the `PushSubscription` details on your server you are good to send them
a message from your server.

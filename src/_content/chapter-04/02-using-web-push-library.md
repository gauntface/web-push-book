---
title: Web Push Node Library
---
# Web Push Node Library

There libraries to make sending push messages easier and it makes sense to
look at one of these libraries just to show how it can manage all the encryption
steps for you.

[web-push](https://github.com/web-push-libs/web-push) is a popular Node.js
library for sending push messages to browsers and for full-disclosure
I've commited code to this project and it's totes the best.

To use it in a new node project you'd first need to install it:

    npm install web-push --save

Then in your javascript file  you'd import it in like so:

// TODO: Move to Demo

```javascript
const webpush = require('web-push');
```

You'll likely want to set up some default values that will be the same for
all your users, like your GCM API key and your application server keys (or
VAPID keys).

// TODO: Move to Demo

```javascript
webpush.setGCMAPIKey('<TODO: Add Example API Key Here>');
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
```

Then we'll need a user's subscription, normally pulled from a database on
your server, but for now let's assume we just copied and pasted a
subscription out of the browser.

```javascript
const subscriptionObject = {
  endpoint: '<TODO: Some example endpoint>',
  keys: {
    p256dh: '<TODO: Some exampe p256dh>',
    auth: '<TODO Some example auth>'
  }
};
webpush.sendNotification(subscriptionObject, 'hello');
```

We can now run that script with the simple command:

    node example.js

This will run the above JavaScript using Node.js and send a message to
that users browser, which will wake up the service worker and dispatch
a `push` event, which we are going to cover in the next section.

While this example is trivial, the only things we'd need to change to make this
useful in a real world scenario is:

1. The payload would be more helpful as a string of JSON.
1. The subscriptions need to be saved and queried from a database.

## Payload

You have complete control over what data you send in a push message, the only
restriction is that it should be less than <a href="https://tools.ietf.org/html/draft-ietf-webpush-protocol-10#section-7.2">4096 bytes</a>.

Most developers will find JSON to be best approach as it's flexible enough to
store any data and easy to parse in most languages. In our node example
we'd send JSON data like so:

    const payload = {
      title: 'This is the Title.',
      body: 'This is the body text.',
      icon: 'https://web-push-book.gaunt.io/notification-icon.png'
    };
    webpush.sendNotification(subscriptionObject, JSON.stringify(payload));

## Saving and Querying Subscription

Saving and querying PushSubscriptions for a database will likely vary on your
service side language and database choice but if it's useful to see an example
of how it could be done, here's the snippets of code from the demo that stores
and retrieves subscriptions in Node.

// TODO Fill in demo content here.

# Web Push Node Library

Let's dive right in to sending a message.

`web-push` is a popular Node.js library for sending push messages to browsers.

Create a new file on your computer `web-push-server/index.js`.

In this new directory `web-push-server` we'll need to first download
the `web-push` library:

    npm install web-push --save

Then we'll pull in this node module in our new `index.js` file.

    const webpush = require('web-push');

Using the new `webpush` variable, we can set up GCM.

    webpush.setGCMApiKey('<TODO: Add Example API Key Here>');

Then we'll need to get a user's subscription, for now let's assume we
just copied and pasted a subscription from the browser into our Node's
`web-push-server/index.js` file.

    const subscriptionObject = {
      endpoint: '<TODO: Some example endpoint>',
      keys: {
        p256dh: '<TODO: Some exampe p256dh>',
        auth: '<TODO Some example auth>'
      }
    };
    webpush.sendNotification(subscriptionObject, 'hello');

We can now run that script with the simple command:

    node web-push-server/index.js

This will run the above JavaScript using Node.js and send a message to
that users browser, which will wake up the service worker and dispatch
a `push` event. If you check the data payload of the `push` event you
should also get the string 'hello'.

    self.addEventListener('push', event => {
          console.log(event.data.text()); // Prints 'hello'
      });

Trvial example I grant you, but the main things we need to change to make this
more useful in a real world scenario is:

1. The payload would be more helpful as JSON.
1. The subscriptions need to be saved and queried from a database.

## Payload

You have complete control over what data you send in a push message, the only
restriction is that it should be less than

// TODO: Check with the spec the current push payload limit

Other than that do as you please, but most developers will find JSON the
best approach is it's flexible enough to store any data and easy to parse in
most languages. In our node example this would like:

    const payload = {
      title: 'This is the Title.',
      body: 'This is the body text.',
      icon: 'https://example.gauntface.com/notification-icon.png'
    };
    webpush.sendNotification(subscriptionObject, JSON.stringify(payload));

In your service worker you'd then access this information using the
`event.data.json()` method.

    self.addEventListener('push', event => {
        const payload = event.data.json();
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon
          });
      });

## Saving and Querying Subscription

// TODO: Add an example of saving subscriptions to a mysql database and
// querying it to send subscriptions

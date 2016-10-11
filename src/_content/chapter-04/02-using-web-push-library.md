---
title: Web Push Node Library
---
# Web Push Node Library

There libraries to make sending push messages easier and it makes sense to
look at one of these libraries just to show how it can manage all the encryption
steps for you.

[web-push](https://github.com/web-push-libs/web-push) is a popular Node.js
library for sending push messages to browsers and for full-disclosure
I've committed code to this project and it's totes the best.

> **Remember**: If you want a library for a different language, be sure to
> checkout the [web-push-libs org on Github](https://github.com/web-push-libs/).

To use it in a new node project, create a file `index.js` and install the
web-push library:

    npm install web-push --save

Then in your javascript file import it in like so:

<% include('../../demo/node-server/index.js', 'web-push-require') %>

Now we can start getting ready for push. You'll want to set up your application
server keys (or VAPID keys).

<% include('../../demo/node-server/index.js', 'web-push-vapid') %>

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
webpush.sendNotification(subscriptionObject, 'hello')
.then(function(response) {
  console.log('Message sent successfully.');
})
.catch(function(err) {
  console.log('Message wasn\'t sent successfully.');
});
```

> **TIP:** If you do actually copy a subscription from your browser be careful
> that the browser doesn't add '...' somewhere in the middle of the values.
> This has happened to me and others far too many times.

We can now run your script with:

    node index.js

This will run the above JavaScript using Node.js and send a message to
that user's browser, which will wake up the service worker and dispatch
a `push` event, which we are going to cover in the next section.

While this example is trivial, the only things we'd need to change to make this
useful in a real world scenario is:

1. The payload would be more helpful as a string of JSON.
1. The subscriptions needs to be saved and queried from a database.

## Payload

You have complete control over what data you send in a push message, the only
restriction is that it should be less than <a href="https://tools.ietf.org/html/draft-ietf-webpush-protocol-10#section-7.2">4096 bytes</a>.

Most developers will find JSON to be best approach as it's flexible enough to
store any data and easy to parse in most languages. In our node example
we're going to send JSON data like so:

```javascript
const payload = {
  title: 'This is the Title.',
  body: 'This is the body text.',
  icon: '/notification-icon.png'
};
webpush.sendNotification(subscriptionObject, JSON.stringify(payload));
```

## Saving a Subscription

Saving and querying PushSubscriptions for a database will likely vary on your
server side language and database choice but it might be useful to see
an example of how it could be done, here's the snippets of code from the
demo that stores and retrieves subscriptions in Node.

The API that receives a subscription and saves it in the database is this.

<% include('../../demo/node-server/index.js', 'save-sub-api') %>

This code has a method `saveSubscriptionToDatabase()` which saves a
subscription in a database, in this case [nedb](https://github.com/louischatriot/nedb).

The following line of code:

<% include('../../demo/node-server/index.js', 'save-sub-api-post') %>

Tell's the *express* web server to create an endpoint for 'POST' requests
on at `/api/save-subscription/`. This endpoint then calls the
`saveSubscriptionToDatabase()` method and returns JSON as a result.

## Querying Subscriptions

// TODO include sample of sending message to all endpoints and managing dead
// subscriptions

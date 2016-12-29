---
title: Web Push Node Library
---
# Web Push Node Library

There are libraries that make sending web push messages super easy and it makes
sense to look at one of these libraries just to show how it can manage all the
encryption steps for you.

[web-push](https://github.com/web-push-libs/web-push) is a popular Node.js
library for sending push messages to browsers and for full-disclosure
I've committed code to this project and it's totes the best.

> **Remember**: If you want a library for a different language, be sure to
> checkout the [web-push-libs org on Github](https://github.com/web-push-libs/).

To install it run the following comment::

    npm install web-push --save

Create a new javascript file `index.js` and require in the `web-push` module
like so:

<% include('../../demos/node-server/index.js', 'web-push-require') %>

We'll need to tell the web-push library what our application server keys are.
You can generate new keys using the `web-push` CLI:

    npm install -g web-push
    web-push generate-vapid-keys

Or, you can quickly [grab a set from here](https://web-push-codelab.appspot.com/).

Then drop them in your `index.js` file like so (remember application server
keys and VAPID keys are the same thing.):

<% include('../../demos/node-server/index.js', 'web-push-vapid') %>

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

<% include('../../demos/node-server/index.js', 'save-sub-api') %>

This code has a method `saveSubscriptionToDatabase()` which saves a
subscription in a database, in this case [nedb](https://github.com/louischatriot/nedb).

The following line of code:

<% include('../../demos/node-server/index.js', 'save-sub-api-post') %>

Tell's the *express* web server to create an endpoint for 'POST' requests
on at `/api/save-subscription/`. This endpoint then calls the
`saveSubscriptionToDatabase()` method and returns JSON as a result.

## Querying Subscriptions

// TODO include sample of sending message to all endpoints and managing dead
// subscriptions

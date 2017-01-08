---
title: Sending Messages with Web Push Libraries
---

# Sending Messages with Web Push Libraries

One of the pain points when working with web push is that sending a push
message is extremely "fiddly". Triggering a push message needs to be a
a POST request to a push service following the
[web push protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol).
To send data with a push message, the data needs to be
[encrypted](https://tools.ietf.org/html/draft-ietf-webpush-encryption) and headers
set so the browser can decrypt the message correctly. Then, to use push across
all browsers without extra setup, you need to use
[VAPID](https://tools.ietf.org/html/draft-thomson-webpush-vapid).

The main issue is that any problem you may hit,
is going to be difficult to diagnose. For this reason, I strongly
recommend using a library to handle the encryption and formatting of your
push request.

If you really want to learn about what the libraries do, we'll cover it in the
next section.

For now, we are going to look at how to manage subscriptions and use a web-push
library to make the push requests.

In this section we'll be using the [web-push](https://github.com/web-push-libs/web-push)
module, a popular Node.js library for sending push messages to browsers.
Other languages will have differences, but they won't be too dissimilar. We are
looking at Node since it's JavaScript and should be the
most accessible for readers.

> **Remember**: If you want a library for a different language,
> checkout the [web-push-libs org on Github](https://github.com/web-push-libs/).

We'll go through the following steps:

1. Look at an example of how to send a subscription to our backend
and how that can be saved.
1. What it looks like to retrieve the saved subscriptions and trigger a push
message.

## Saving Subscriptions

Saving and querying PushSubscriptions from a database will vary depending on
your server side language and database choice but it might be useful to see
an example of how it could be done.

In your web app running in the browser, when we have a new subscription, we
need to send that to our server, which we can do with a simple POST request:

<% include('../../demos/node-server/frontend/app.js', 'send-subscription-to-server') %>

On our node server (in this case using Express), we'd set up the matching
request listener for `/api/save-subscription/`:

<% include('../../demos/node-server/index.js', 'save-sub-api-post') %>

Then we'd validate the subscription, just to make sure the request is ok:

<% include('../../demos/node-server/index.js', 'save-sub-api-validate') %>

If the subscription is valid, we need to save it and return an appropriate
JSON response if the saving was successful:

<% include('../../demos/node-server/index.js', 'save-sub-api-save-subscription') %>

This demo uses [nedb](https://github.com/louischatriot/nedb) to store the
subscriptions, but you could use any database you chose.

<% include('../../demos/node-server/index.js', 'save-sub-function') %>

## Sending Push Messages

When it comes to sending a push message, you need either a tool, or an admin
panel to get the subscriptions from your database, and loop over them to
trigger push messages.

Before we can start sending push messages, we need to make a public, private
key set of application servery keys (a.k.a VAPID keys) to use in our web app.

You can grab a set of application server keys [from here](https://web-push-codelab.appspot.com/).

Just copy the values over into your node script. In the
[demo that accompanies this book]([demo app](https://github.com/gauntface/web-push-book/tree/master/src/demos/node-server),
this code can be found in the `index.js` file under the 'demos/node-server/'
directory.

<% include('../../demos/node-server/index.js', 'vapid-keys') %>

Next we need to install the `web-push` module:

    npm install web-push --save

Then in our node script we require in the `web-push` module
like so:

<% include('../../demos/node-server/index.js', 'web-push-require') %>

Now we can use the `web-push` module, we need to tell about the application
server keys:

<% include('../../demos/node-server/index.js', 'web-push-vapid') %>

With this, the `web-push` module is ready to use, so next step is to trigger
push messages.

In this demo, we have an admin panel that can be used to trigger
a push message, which is done via a POST request to `/api/trigger-push-msg/`.

<% include('../../demos/node-server/index.js', 'trig-push-api-post') %>

When a request is made, we grab the subscriptions from the database and
for each one, we trigger a push message.

<% include('../../demos/node-server/index.js', 'trig-push-send-push') %>

The call to `webpush.sendNotification()` returns a promise which resolves if
the request was successful or it rejects if there was an issue.

When the promise rejects, we check the status code and if it's '410', which is
the HTTP status code for 'GONE'. If we receive this status code, it means the
subscription is no longer valid and should be removed from our database.

<% include('../../demos/node-server/index.js', 'trig-push-send-notification') %>

After looping over the subscriptions, we just need to return a JSON response.

<% include('../../demos/node-server/index.js', 'trig-push-return-response') %>

We've gone over the major implementation steps.

1. Create an API to send subscriptions to our back-end and save them.
1. Create some way to trigger sending push messages (Here did an API behind
  a fake API).
1. When we want to send a message, get all the subscriptions from our backend
and send a message to each one with a [web-push library](https://github.com/web-push-libs/).

Regardless of your backend (Node, PHP, Python, ....) these are going to be the
rough steps for your implementation.

Next up, what exactly is the Web Push library doing?

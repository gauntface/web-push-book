---
title: Subscribing a User
---
# Subscribing a User

The first step we need to take is getting permission for the user to send
them push messages and then our hands on a `PushSubscription`.

The JavaScript API to do this is pretty straight forward, so let's go through
the flow.

## Feature Detection

Before we ask the user for permission, we should check if the current browser
supports push messaging or not. The main things we need to check for are
the *serviceWorker* API in *navigator* and *PushManager* in *window*.

<% include('../../demo/app.js', 'feature-detect') %>

While browser support is growing quickly for both service worker and
push messaging support, it's always a good idea to feature detect and
progressively enhance like this.

## Register a Service Worker

Knowing that service worker and Push is supported, we need to tell the browser
where our special service worker file is (this is the JavaScript file
that will be called when a message is received).

You'd create a file JavaScript on your web server and simply call
`navigator.serviceWorker.register()` passing in the path to your file,
like so:

<% include('./code-samples/register-sw/register.js') %>

This code tells the browser that you have a service worker file and where
its located, in this case `/service-worker.js`. Behind the scenes
the browser will download your service worker file, run it and if everything
went well, the promise it returns will resolve. If there are any errors, of
any kind, the promise will reject. If your service worker does reject, double
check your JavaScript and make sure nothing is causing an error to be thrown.

Once `register()` resolves, it returns a `ServiceWorkerRegistration` which
we'll use to get the `PushSubscript`, but first we need to get permission from
the user.

## Requesting Permission



## Subscribe a User with PushManager

Using your new service worker registration, we can subscribe a user
for push by calling `subscribe()` on your push manager.

<% include('./code-samples/subscribe-push.js') %>

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

<% include('./code-samples/print-subscription.js') %>

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

<% include('./code-samples/using-getkey.js') %>

Just for an example, to make a POST request to send a subscription to my
server you'd have a promise chain like so:

<% include('./code-samples/full-promise-chain.js') %>

With the `PushSubscription` details on your server you are good to send them
a message from your server.

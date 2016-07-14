# Overview of Push

Let's start off with how push notifications work at a high level.

There are three main pieces we're going to step through.

1. The client side piece (i.e. JavaScript in your website / web app)
1. The back end API for triggering the push notifications
1. The service worker code. This is the JavaScript code that'll receive the
   push message and display the notification.

## Client Side

When you want to subscribe a user to push messages, the main thing you'll want
to do is get a `PushSubscription` and send it to your server and save it for
later.

A `PushSubscription` is an object which gives you everything you need
to send a message from your server to the user.

![One a user is subscribed, the browser will give you a PushSubscription which you need to send and store on your server](build/images/browser-to-server.png)

## Server Side

One of the values of a `PushSubscription` object is an `endpoint`, which will
be a URL that you can make a network request to sending a push message to a
a users browser.

The API call needs to follow a specific format. The API is known as the
web push protocol.

// TODO: Diagram of server -> Browser

## Service Worker Code

When a push message is received by a browser, the browser dispatches an event
to a JavaScript file known as a Service Worker, which we'll cover in the next
section.

It's inside the `push` event that you'll need to show a notification
to the user.

// TODO: Diagram of Browser -> Notification

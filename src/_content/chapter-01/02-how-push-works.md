---
title: How Push Works
---
# How Push Works

Before getting into the API, let's look at push from start to finish. This way, as we step through individual
topics or API's, you'll have an idea of how and why it's important.

The three key steps to implementing push are:

1. Adding the client side logic to subscribe a user to push (i.e. JavaScript and UI in your web app).
1. The API call from your back-end / server that triggers a push message.
1. The service worker JavaScript file that will receive a push event after a push is sent.

Let's look at what each of these steps entails in a little more detail.

## Step 1: Client Side

Before you can send a push message to a user, you need to "subscribe" a user to push messaging.

Subscribing the user for push requires two things. First, getting **permission** from the user to send them push messages. Second, getting a `PushSubscription` from the browser.

A `PushSubscription` contains all the information we need to send a push message to that user. You can "kind of" think of this as a ID for that user's device.

This is all done in JavaScript with the Push API.

Before subscribing a user you'll need to generate a set of
"application server keys", which we'll cover later on.

The application server keys, also known as VAPID keys, are unique to your server.  They allow a push service to know which application server subscribed a user and ensure that it's the same server sending messages.

Once you've subscribed the user and have a `PushSubscription` you'll need to send it to your backend / server.  On your server, you'll save this subscription to a database and use it to send a push message to that user.

![Make sure you send the PushSubscription to your backend.](/images/svgs/browser-to-server.svg)

## Step 2: Send a Push Message

When you want to send a push message to your users you need to make an API call to a push service. This API call would include what data to send, who to send it to and details about how to send it.

The `PushSubscription` has the information for who to send the push to. You can define the data to send and how to send it.

The remaining questions are:

- Who and what is the push service?

- What does the API look like? Is it JSON, XML, something else?

- What can the API do?

### Who and What is the Push Service?

A push service has the job of receiving requests to send push messages and delivering them.

Each browser can use any push service they want, it's something developers have no control over. The key thing to know is that every push service expects the **same** API call. Meaning you don't have to care who the push service is, you just need to make sure that your API call is valid.

Every browser uses a push service, let's say it's completely random, how do you know what service to use?

It's given to you via the `PushSubscription` via the **endpoint** value. A push subscription object has these values:

<% include('./code-samples/example-subscription.json') %>

The **endpoint** in this case is *https://random-push-service.com/some-kind-of-unique-id-1234/v2/*. The push service is 'random-push-service.com' and each endpoint is unique to a user.

We'll cover The **keys** parameter later on.

### What does the API look like?

I mentioned that every web push service expects the same API call. That API is the [**Web Push Protocol**](https://tools.ietf.org/html/draft-ietf-webpush-protocol).

It's an IETF standard that defines how you make an API call to a push service.

The API call requires certain headers to be set and the data to be a stream of bytes. We'll look at libraries to make this API call for us.

### What can the API do?

The API provides a way to send a message to a user, with data, and provide instructions of *how* to send the message.

The data you send with a push message must be encrypted. This prevents push services being able to view the data sent in a push message. This is important given that it's the browser who decides which push service to use,. This opens the door to browsers being able to isn't a push service that isn't safe.

When you send a push message the push service will receive the API call and queue the message. This queue will remain until the users device comes online and the push service can deliver the messages. The instructions you can give to the push service defines how the push message is queued.

The instructions include details like:

- The time-to-live for a push message. This defines how long a message should be queued before it's removed and not delivered.

- Define the urgency of the message. This is useful in case the push service can do anything to deliver the message sooner.

- Give a push message a "topic" name that will replace a pending message with a new push.

![When your server wishes to send a push message, it makes a web push protocol request to a push service.](/images/svgs/server-to-push-service.svg)

## Step 3: Push Event on the Users Device

Once we've sent a push message, the push service will keep your message on it's server until one of two things happens:

1. The device comes online and the push service can deliver the message.
1. The message expires before it's delivered. If this occurs the push service removes the message from it's queue.

When the push service does deliver a message, the browser will dispatch a `push` event in your service worker.

A service worker is a "special" JavaScript file. The browser can execute this JavaScript without your page being open. A service worker also has API's like push that aren't available outside of a service worker.

It's inside the service worker's 'push' event that you can perform any background tasks. You can make analytics calls, cache pages offline or show notifications.

![When a push message is sent from a push service to a users device, your service worker receives a push event.](/images/svgs/push-service-to-sw-event.svg)

That's the whole flow for push messaging. Lets go through each step in more detail.

---
title: How Push Works
weight: 2
---
Before getting into the API, let's look at push from a high level, start to finish. Then as we step through specific topics or APIs, you'll understand how it fits into the overall story of web push.

The three steps to implementing push are:

1. Adding the client-side logic to subscribe a user to push (i.e., the JavaScript and UI in your web app that registers a user to push messages).
1. The API call from your backend/application that triggers a push message to a user's device.
1. The service worker JavaScript file that receives "push events" when the push arrives on the device. It's in this JavaScript that you'll show a notification.

Let's look at what each of these steps entails in a little more detail.

## Step 1: Client Side

Before you can send push messages to a user, you need them to "subscribe" to your service to receive notifications.

Subscribing the user requires gaining permission to display notifications using the [Notifcations](https://developer.mozilla.org/en-US/docs/Web/API/notification) and [Permissions](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) APIs followed by requesting a `PushSubscription` using the [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API).

A `PushSubscription` contains all the information we need to send a push message to a particular user. You can think of this as an ID for that user's device.

Once you have a `PushSubscription`, you'll need to send it to your backend/server and save it to a database.

![Make sure you send the PushSubscription to your backend.](/images/svgs/browser-to-server.svg)

## Step 2: Send a Push Message

When you want to send a push message to your users, make a REST API call to a push service's endpoint. This API call would include who to send the message to, data to send, and options defining how the push service should send the message. Typically this API call is done from your server.

Some questions you might be asking yourself:

- Who and what is a push service?

- What is the API? Is it JSON, XML, something else?

- What can the API do?

### Who and What is the Push Service?

A push service provides endpoints that process API calls to trigger push messages and manages the delivery of them to browsers. For developers sending push messages, it's just a URL to send REST APIs to.

This endpoint is part of the `PushSubscription` we discussed in the previous section.

Below is an example of the values you'll get from a **PushSubscription**:

```json
{
  "endpoint": "https://random-push-service.com/unique-id-1234/",
  "keys": {
    "p256dh" : "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM=",
    "auth"   : "tBHItJI5svbpez7KI4CCXg=="
  }
}
```

The **endpoint**, in this example, is `https://random-push-service.com/some-kind-of-unique-id-1234/`. The push service would be `random-push-service.com`, and the endpoint is unique to a user, indicated by 'unique-id-1234/'. As you start working with web push, you'll notice this pattern.

It's the responsibility of push services to receives network requests (API calls), validate them, and manage the delivery of push messages, including queuing messages for offline browsers, waiting until the browser comes online or the message expires.

Browsers dictate which push service to use; developers have no control over it. Since every push service implements the **same** API, there is no need to worry about the variety of push services; instead, developers need to focus on making valid API calls.

### What is the API?

I mentioned that every web push service expects the same API call. That API is the [**Web Push Protocol**](https://tools.ietf.org/html/draft-ietf-webpush-protocol).

It's an IETF standard that defines how you make an API call to a push service.

The API call requires specific headers and the data to be a stream of bytes. We'll look at libraries that can perform this API call for us as well as how to do it ourselves.

### What can the API do?

The API provides a way to send a message to a user, with optional data, and provides instructions on *how* to deliver the message.

The data you send with a push message must be encrypted, preventing push services from viewing it. This step is vital given that it's the browser who decides which push service to use, which could open the door to browsers using a push service that isn't safe or secure.

When you send a push message, the push service receives the API call and queues the message. This message remains queued until the user's device comes online, and the push service can deliver the message. You can define how to queue the message using instructional headers in your API call.

The instructions include details like:

- The time-to-live (TTL) for a push message. The TTL controls how long a message is queued before it's removed and not delivered.

- Define the urgency of the message. Urgency enables the push service to prioritize the user's battery life by only delivering high priority messages or waiting until the next opportunity to deliver messages.

- Giving a push message a "topic" name, forces any queued messages with the same topic to be replaced with the latest message.

![When your server wishes to send a push message, it makes a web push protocol request to a push service.](/images/svgs/server-to-push-service.svg)

## Step 3: Push Event on the User's Device

Once we've sent a push message, the push service keeps your message on its server until one of the following events occurs:

1. The device comes online, and the push service delivers the message.
1. The message expires. If this occurs, the push service removes the message from its queue, and the message is never delivered.

When the push service does deliver a message, the browser receives the message, decrypts any data, and dispatches a `push` event in your service worker.

A [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) is a "special" JavaScript file. The browser can execute this JavaScript without your page being open. It can even execute this JavaScript when the browser is closed. A service worker has APIs that aren't available on web pages (i.e., APIs that aren't available out of a service worker script).

It's inside the service worker's 'push' event that you can perform any background tasks. You can make analytics calls, cache pages offline, and show notifications.

![Your service worker receives a push event when a push service sends a message to a user's device.](/images/svgs/push-service-to-sw-event.svg)

That's the flow for push messaging. The next couple of sections goes through each step in more detail.

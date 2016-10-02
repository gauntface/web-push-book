---
title: How Push Works
---
# How Push Works

Before getting into the API, it's useful to consider how everything
fits together, from start to finish, so that as we step through individual
topics or API's, you'll have an idea of how it fits in to the overall goal of
implmenting push messages.

The three key steps to implementing push are:

1. Adding the client side logic to subscribe a user to push
  (i.e. JavaScript and UI in your web site / web app).
1. The API call your backend / server will need to make to trigger a push
  message.
1. The service worker JavaScript file that will receive a push event when the
  push message is received on the users device.

Let's look at what each of these steps entail in a little more detail.

## Step 1: Client Side

Before you can send a push message to a user, you need to "subscribe" a user
to push messaging.

Subscribing the user for push is the process of getting
**persmission** to send them push messages, followed by getting
a `PushSubscription` from the browser.

A `PushSubscription` contains all the information we need to send a push message
to that user, you can loosely think of this as a ID for that users device.

This is all done in JavaScript with a simple API.

One thing you'll want to do before subscribing a user is generate a set of
"application server keys" (We'll show how to generate them later on).

The application server keys, also known as VAPID keys, are designed to be
unique to your server and allow a push service to know who subscribed the user
and ensure that it's the same application sending messages.

Once you've subscribe the user the only thing left to do, is to send the
`PushSubscription` to your backend / server so that when you want to send a push message,
you retrieve the subscription and send send a message with it.

![Make sure you send the PushSubscription to your backend.](/images/png-version/browser-to-server.png)

## Step 2: Trigger a Push Message

If you think of a `PushSubscription` as a kind of ID for the user, it's easy to
picture a service where you pass it an ID, in this case the subscription, and
that service finds the device the ID is tied and sends a push message to it.

In a very vague, handy wavey, sort of way, is what we do with the
`PushSubscription`.

The main questions that this raises is, what service do we use? How do we give
it the ID so it can send the message? Can I give it data to send with message?

### What Push Service Do We Use?

Push on the web has lots of push services that will handle delivering push
messages to a user.

The reason this is possible and sane for a developer is that every push service
has the **same** API. Meaning you don't have to care who the push service is,
you just need to make sure what API calls to it are valid.

One thing to note is that it is up to the browser to decide which push service
a subscription is tied to, you can't decide or change it.

As an example, when you get a push subscription, it has these values:

<% include('./code-samples/example-subscription.json') %>

The **endpoint**, in this case *https://random-push-service.com/...*, is the
push service you need to send the message to. On the end of the URL is a
unique string that essentially acts as the "ID" for the user.

This means we have a subscription and that gives us the URL for the push service
that will deliver our message & the URL idenitifies the user because it's
unique, so how do we send a message?

### How Do We Send A Push Message?

I briefly mentioned that every push service on the web has the same API. That
API is called the [**Web Push Protocol**](https://tools.ietf.org/html/draft-ietf-webpush-protocol).

It's a IETF standard that defines how you make an API call to the *endpoint*
on a `PushSubscription`. Basically, you need to make a network request to
the *endpoint*.

### Can I Send Data?

You most certainly can! There is one gotcha though, sorry. You need to
encrypt the data before you send the message.

The reason for this is security concerns. Since the browser decides who the
push service is, it means the browser *could* pick a push service that isn't
very safe. By encrypting the data, it means the push service can read the data
you're sending, giving a level of privacy that would be lost otherwise.

![When your server wishes to send a push message, it makes a web push protocol request to a push service.](/images/png-version/server-to-push-service.png)

## Step 3: Push Event on the Users Device

Once we've sent a push message, the push service will keep your message on it's
server until one of two things happens:

1. The device comes online and the push service can deliver the message.
1. The message expires before the it could be delivered, in which case the
push service removes it from it's queue / drops the message.

When the push service can delivery a message the browser will receive it and
call a JavaScript file for you site and dispatch a `push` event. It's inside
this event that you can performa any background tasks you want and show a
notification to your user.

The JavaScript file the browser runs is a special file called a
**service worker**. The reason it's special is that the browser can run this
JavaScript without your web page needing to be open, making it perfect to
handle push events.

![When a push message is sent from a push service to a users device, your service worker receives a push event.](/images/png-version/push-service-to-sw-event.png)

That's the overall flow. Next is to go into more detail of each step.

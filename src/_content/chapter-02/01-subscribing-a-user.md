---
title: Subscribing a User
---
# Subscribing a User

The first step we need to take, is gett permission for the user to send
them push messages. Once we have permission, we can get our hands on a `PushSubscription`.

The JavaScript API to do this is pretty straight forward, so let's go through the flow.

## Feature Detection

The first we need to do is check if the current browser supports push messaging or not. We can check push is support with two simple checks.

1. Check the *serviceWorker* API on the *navigator*.
1. Check *PushManager* on  the *window*.

<% include('../../demos/web-app/app.js', 'feature-detect') %>

While browser support is growing quickly for both service worker and
push messaging support, it's always a good idea to feature detect for both and
[progressively enhance](https://en.wikipedia.org/wiki/Progressive_enhancement).

## Register a Service Worker

With the feature detect we knowing that service workers and Push are supported. The next step is to "register" our service worker.

When we register a service worker, we are telling the browser what file to use for push events. The file is still just JavaScript, but the browser will "give it access" to the service worker APIs. To be more exact, the browser runs the file in a service worker context.

To register a service worker, call `navigator.serviceWorker.register()`, passing in the path to our file. Like so:

<% include('../../demos/web-app/app.js', 'register-sw') %>

This code above tells the browser that we have a service worker file and where its located. In this case, the service worker file is at `/service-worker.js`. Behind the scenes the browser will take the following steps after calling `register()`:

1. Download the service worker file.

1. Run the JavaScript.

1. If everything ran correctly and there were no error, the promise returned by `register()` will resolve. If there are errors of
any kind, the promise will reject.

> If `register()` does reject, double check your JavaScript for typos / errors in Chrome DevTools.

When `register()` does resolve, it returns a `ServiceWorkerRegistration`. With this registration, we have access to the `PushManager` API.

## Requesting Permission

The next step to take is to get permission from the user to show notifications.

The API for getting permission is relatively simple, the only downside is that
the API [recently changed from taking a callback to returning a Promise](
    https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission).

The problem with this, is that we can't tell what version of the API will be supported by the current browser, so you have to implement both and handle both.

<% include('../../demos/web-app/app.js', 'request-permission') %>

In the above code, this important bit is the call to `Notification.requestPermission()`. This method will display a prompt to the user:

![Permission Prompt on Desktop and Mobile Chrome.](/images/permission-prompt.png)

Once the permission has been accepted, closed (i.e. clicking the cross on the
pop-up) or blocked, we'll be given the result as a string: 'granted',
'default' or 'denied'.

In the sample above, the promise only resolves if the permission is granted,
otherwise we throw an error making the promise reject.

The important thing to remember is that if the user clicks the 'Block' button, your web app will not be able to ask the user for the Notification permission again until the user "unblocks" / changes the permissions in a buried settings panel. Think carefully about how and when you ask the user for permission. The good news is that most users are happy to give permission as
long as it's asked in a way that they *know* why the permission is being asked.

We'll look at how some popular sites ask for permission later on.

## Subscribe a User with PushManager

Once the permission is granted and we have our service worker registration we can subscribe a user by calling `registration.pushManager.subscribe()`.

<% include('../../demos/web-app/app.js', 'subscribe-user') %>

When we call the `subscribe()` method, we pass in a *options* object. Some of
these fields are required and some of them are optional.

Lets look at both of the options we've passed in.

### userVisibleOnly

When push was first added to browsers there was uncertainty about whether
developers should be able to send a push message and not let the user know
about it, this is commonly referred to as silent push.

The concern was that developers could do nasty things like track a user's
location on an ongoing basis without the user knowing.

To avoid this scenario and to give spec authors time to consider what to do
with this matter, the `userVisibleOnly` option was added and passing in
a value of **true** is making an agreement with the browser that we'll show
a notification every time a push is received (i.e. no silent push).

At the moment you can't pass in anything else. If you don't include the
`userVisibleOnly` key you'll get the following error:

> Failed to subscribe the user. DOMException: Registration failed -
> missing applicationServerKey, and manifest empty or missing

If you pass in a value of **false**, i.e. you want the ability to send silent
pushes, you'll get this error:

> Chrome currently only supports the Push API for subscriptions that
> will result in user-visible messages. You can indicate this by
> calling pushManager.subscribe({userVisibleOnly: true}) instead.
> See [https://goo.gl/yqv4Q4](https://goo.gl/yqv4Q4) for more details.

It's currently looking like blanket silent push will never be implemented,
but instead some kind of budget API will be used to give web apps a certain
amount of silent push messages and the budget for these will change over time
based on the use of your web app.

### aplicationServerKey Option

We briefly mentioned that application server keys are used by a push service
to know what application is subscribing a user and ensuring that the same
application is subscribing that user, but we didn't explain how that's done.

Application server keys have a public and private key pair where the private
key should be kept a secret to your application and the public key can be
shared with push services.

The `applicationServerKey` option is the public key for your application server,
and given this the browser will pass that option to a push service and can use
it to generate a *PushSubscription* endpoint.

The diagram below shows these steps.

1. You web app is loaded in a browser and you call *subscribe()* passing in your
public application server key.
1. The browser then makes a network request to a push service who will generate
an endpoint, associate that endpoint with that public key and return the
endpoint to the browser.
1. The endpoint will then be used to form part of the *PushSubscription* which is then passed
back to your web app as the result of the *subscribe()* call.

![Illustration of the public application server key is used in subscribe method.](/images/svgs/application-server-key-subscribe.svg)

When you later want to send a push message to a *PushSubscription*, you'll
need to create an **Authorization** header which is a set of information
signed with your application server's **private key**. When the push service
receives a request to send a push message, it can look up the public key
it has for that endpoint and decrypt the **Authorization** header. If
the decryption step worked, the push service knows that it must have come from
the application server with the **matching private key**. It's basically a
security measure that prevents anyone else sending messages to your users.

![Illustration of how the private application server key is used when sending a message.](/images/svgs/application-server-key-send.svg)

Technically, the `applicationServerKey` is optional. However, the easiest
implementation on Chrome requires it and other browsers may require it in
the future. At the moment Firefox doesn't require it.

The specification that defines *what* the application server key should be is
the [VAPID spec](https://tools.ietf.org/html/draft-thomson-webpush-vapid).
If you read something referring to *"application server keys"* or
*"VAPID keys"*, just remember that they are the same thing.

That's all of the subscribe options but before we go to the next section, one
thing to mention is that if you call `subscribe()` and your web app doesn't
already have permissions for notifications, the browser will request the
permissions for you. This is useful if your UI works with this flow, but if you
want more control (and I think most developers will), stick to the
`Notification.requestPermission()` API.

## What is a PushSubscription?

We've called `subscribe()` and passed the options that we want and this will
return a promise that resolves to a `PushSubscription`.

<% include('../../demos/web-app/app.js', 'subscribe-user') %>

This `PushSubscription` object contains all required information needed to
send a push messages to that user. If you print
out the `JSON.stringify()` version of the subscription object, we'd see
the following:

```json
{
  "endpoint": "https://some.pushservice.com/something-unique",
  "keys": {
    "p256dh": "BIPUL12DLfytvTajnryr2PRdAgXS3HGKiLqndGcJGabyhHheJYlNGCeXl1dn18gSJ1WAkAPIxr4gK0_dQds4yiI=",
    "auth":"FPssNDTKnInHVndSTdbKFw=="
  }
}
```

The **endpoint** is the push services URL, you call this URL to trigger a push
message.

The **keys** object contains the values used to encrypt any data that to send
with your push message (which we'll discuss later on in this book).

## Send a Subscription to Your Server

Once you have a subscription you'll want to send it to your server. It's up
to you how you do that but a tiny tip is to use
`JSON.strinigify()` to get all the necessary data out of the subscription
object, without it you'll need to use `getKey` to get the encryption keys
used for payload:

```javascript
const subscriptionObject = {
  endpoint: subscription.endpoint,
  keys: {
    p256dh: subscription.getKeys('p256dh'),
    auth: subscription.getKeys('auth')
  }
};

// The above is the same output as:

const subscriptionObjectToo = JSON.stringify(subscription);
```

In the demo used throughout this book, we make a POST request to send a
subscription to our node server that stores the subscription in a database.

Sending the subscription is done like so:

<% include('../../demos/web-app/app.js', 'send-subscription-to-server') %>

With the `PushSubscription` details on our server we are good to send our user
a message.

## FAQs

A few common questions people have asked at this point:

> Can I change the push service a browser uses?

No. The push service is selected by the browser and as we saw with the
`subscribe()` call, the browser will make network request to the push service
to retrieve details used to make a *PushSubscription*.

> Each browser uses a different Push Service, don't they have different API's?

All push services will have the same API available for you to use.

This common API is called the `web push protocol` and describes the network
request your server will need to make to trigger a push message.

> If I subscribe a user on their desktop, are they subscribed on their phone
as well?

Unfortunately not. A user must register for push on each browser they wish to
receive messages from. It's also worth noting that this will require
the user granting permission on each device as well.

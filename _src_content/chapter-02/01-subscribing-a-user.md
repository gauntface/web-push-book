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

<% include('../../demo/web-app/app.js', 'feature-detect') %>

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

<% include('../../demo/web-app/app.js', 'register-sw') %>

This code tells the browser that you have a service worker file and where
its located, in this case `/service-worker.js`. Behind the scenes
the browser will download your service worker file, run it and if everything
went well, the promise it returns will resolve. If there are any errors, of
any kind, the promise will reject. If your service worker does reject, double
check your JavaScript and make sure nothing is causing an error to be thrown.

Once `register()` resolves, it returns a `ServiceWorkerRegistration` which
we'll use to get the `PushSubscription`.

## Requesting Permission

With our service worker registered and we know there aren't any problems there,
we need to get permissions.

As with any API that gives special privileges to a web app, like geolocation and
access to the camera, you need to ask the user for permission first.

Browsers require every web app to show a notification to the user
whenever a push message is received. To display a notification,
you need permission from the user, without this permission we can't get
a `PushSubscription`.

The API for getting permission is relatively simple, the only downside is that
the API [recently changed from taking a callback to returning a Promise](
    https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission).
The problem is that we can't tell what version of the API will be supported,
so you have to implement both and handle both.

<% include('../../demo/web-app/app.js', 'request-permission') %>

We call `Notification.requestPermission()`, which displays a notification prompt
as shown below.

![Permission Prompt on Desktop and Mobile Chrome.](/images/permission-prompt.png)

Once the permission has been accepted, closed (i.e. clicking the cross on the
pop-up) or blocked, we'll be given the result as a string of 'granted',
'default' or 'denied'.

In the sample above the promise only resolves if the permission is granted,
otherwise we throw an error making the promise reject.

The important thing to remember is that if the user clicks 'Block', your web
app will not be able to ask the user for the Notification permission again until
they reset the permission state, so think think carefully about how you
ask the user. The good news is that most users are happy to give permission as
long as it's asked in a way that they *know* why the permission is being asked.

We'll look more into the UX of asking for permission later on.

## Subscribe a User with PushManager

Using your new service worker registration and permission granted we can
subscribe a user for push by calling `registration.pushManager.subscribe()`.

<% include('../../demo/web-app/app.js', 'subscribe-user') %>

When we call the `subscribe()` method we pass in a *options* object. Some of
these fields are required and some of them are optional.

Lets look at both of the options we've passed in.

### userVisibleOnly Option

When push was first added to browsers there was uncertainty about whether
developers should be able to send a push message and not let the user know
about it, this is commonly reffered to as silent push.

The concern was that developers could do nasty things like track a users
location on an ongoing basis without the user knowing.

To avoid this scenario and to give spec authors time to consider what to do
with this matter, the `userVisibleOnly` option was added and passing in
a value of **true** is making an agreement with the browser that we'll show
a notification every time a push is received (i.e. no silent push).

At the moment you can't pass in anything else. If you don't include the
`userVisibleOnly` key you'll get the following error:

// TODO: Print error of no options passed to subscribe()

If you pass in a value of **false**, i.e. you want the ability to send silent
pushes, you'll get this error:

// TODO: Print error of uservisibleOnly: false

It's currently looking like blanket silent push will never be implemented,
but instead some kind of budget API will be used to give web apps a certain
amount of silent push messages and the budget for these will change over time
based on the use of your web app.

### aplicationServerKey Option





The result of calling `subscribe()` is a promise that resolved to a
`PushSubscription` object which will give you the required information to
send a push messages to that user. If you print
out the subscription object from above we'd see the following:

<% include('./code-samples/print-subscription.js') %>

The endpoint is the push services URL, you call this URL to trigger a push
message. The `keys` object is used to encrypt any data that to send with
your push message (which we'll discuss later on in this book).

When you call `subscribe()`, if your site doesn't already have permissions
to show notifications, the browser will request permission from the user
and if the user grants you those permissions, it'll "subscribe" the user to
a push service.

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

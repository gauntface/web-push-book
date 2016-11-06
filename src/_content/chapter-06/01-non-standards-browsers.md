---
title: Non-Standards Browsers
---
# Non-Standards Browsers

We've been using the application server key throughout this book because
it's the Web Standards approach of implementing push. In older
versions of Chrome (version 51 and before), Opera for Android and the
Samsung Internet Browser required a `gcm_sender_id` because the application
server key was supported (it was event spec'd when these browsers were
supporting push).

In this section we are going to look at how you support these browsers
with a `gcm_sender_id`.

## What is gcm_sender_id

The whole "gcm_sender_id" thing came about in the early versions of Chrome
when it first implemented push. Google had a push service called "Google
Cloud Messaging", which is now called Firebase Cloud Messaging, both of which
are commonly referred to as "GCM" and "FCM" for short.

To get push implemented in Chrome, it made sense to use "GCM", but it had
two major drawbacks.

1. GCM needed a developer account to be set up and a "Sender ID" passed to
Chrome.
1. GCM required a special "Authorization" header from the developer account
when sending a push message.

First we'll look at how to create one of these projects to get the
"Sender ID" and the key for the "Authorization" header.

Then we'll look at adding the "gcm_sender_id" and what the unique header
means when triggering a push.

## Creating a Firebase Account

I briefly mentioned that Google Cloud Messaging was renamed Firebase
Cloud Messaging. This is because throughout the rest of the section I will
be talking about Firebase Cloud Messaging, FCM for short, because it works
with these older browsers is the easiest / best way to support them.

The first step is to create a new Firebase project on [https://console.firebase.google.com](https://console.firebase.google.com).

![Firebase Console Page](/images/firebase-setup/01-firebase-console.png){: .center-image }

Creating a new project is simple, just fill in your project name and select
your country.

![Firebase Create Project](/images/firebase-setup/02-firebase-create-project.png){: .center-image }

Once you've created your project, you'll find all the important push specific
bits in settings, which can be find but hovering / clicking the cog next
to your projects name.

![Firebase Settings Pop Up](/images/firebase-setup/05-firebase-project-settings-pop-up-highlight.png){: .center-image }

In settings, click on the "Cloud Messaging" tab and here you'll find a "Server
key" and a "Sender ID". This are the two pieces of information we'll need later
on in this section.

![Firebase Cloud Messaging Settings](/images/firebase-setup/07-firebase-cloud-settings.png){: .center-image }

Now that we've got a sender ID, let's look at how we use it.

## Adding a Web App Manifest

The non-standards browsers will look for your sender ID in a web app manifest,
which is a JSON file browsers can use to gain extra information
about your web app. This includes meta data like your web app's name,
icon, theme color and other goodies, to learn more [check out the
MDN docs](https://developer.mozilla.org/en-US/docs/Web/Manifest).

For push, all we need is a JSON file with the field "gcm_sender_id"
in it and assign the Sender ID from our Firebase project, like this:

<% include('../../demo/web-app/manifest.json') %>

Save this JSON as a file on your site, the demo for this site has a file
called 'manifest.json' at the root of the site, i.e. '/manifest.json'.

To make the browser aware that you have a manifest, we need to add it to
the `head` of our page with a link tag.

```html
<link rel="manifest" href="/manifest.json">
```

With this set up you can subscribe in these browsers and fingers crossed
it'll work.

If anything does wrong, you might receive an error like this:

```
Registration failed - no sender id provided
```

```
Registration failed - manifest empty or missing
```

```
Registration failed - gcm_sender_id not found in manifest
```

In Chrome, you can still test the gcm_sender_id by removing the
*applicationServerKey* when you call `subscribe()` and if anything is wrong
in this case, the error may be:

```
Failed to subscribe the user. DOMException: Registration failed - missing applicationServerKey, and manifest empty or missing
```

The best thing to do if you hit these problems is to make sure your manifest
is discoverable and is valid JSON. The easiest way to check is to go into
Chrome DevTools, select the **Application** pane, select the **Manifest** tab
and click the 'Add to homescreen' link, this will force Chrome to get the
manifest and parse it.

![DevTools Manifest Check](/images/devtools/manifest-check.png){: .center-image }

## Using the Server Key

Once you've got a PushSusbcription, you can tell if it's using the
`gcm_sender_id` from your manifest because the endpoint for the subscription
will start with `https://android.googleapis.com/gcm/send/`.

For these PushSubscriptions, you can still send a Web Push Protocol request,
but you need to set the **Authorization** header to the "Server Key" from your
Firebase project. The 'Authorization' would normally be the signed JWT using
your application server keys, so you need to figure out which one to use.

Most (if not all) [Web Push libraries on Github](https://github.com/web-push-libs/)
should do all of this for you.

The code that does this for the Node Web Library is:

```javascript
const isGCM = subscription.endpoint.indexOf(
  'https://android.googleapis.com/gcm/send') === 0;
if (isGCM) {
  requestDetails.headers.Authorization = 'key=' + currentGCMAPIKey;
} else {
  // Add Application Server Key Details
  ...
}
```

## Browser Specifics

### Opera for Desktop

One thing to call out with Opera is that at the time of writing push is supported
on their Android browser. On Desktop the API's are visible, but once you
call subscribe, it will reject. There is no obvious way of feature detecting
this sadly.

You'll need to either detect you are in Opera on desktop with
user agent sniffing or simply let users go through your UI to enable push
and fail at that point.

### No Payload

At the time of writing the Samsung Internet Browser doesn't support
sending data with a push message (although it should do soon). This may also
be the case with new browsers as they start to support web push.

This isn't necessarily a bad thing as you can make an API call when
a push message is received, but for some this causes a great deal of
complication. If you fall into the bracket of requiring payload support you
can feature detect payload support by checking for the existence of `getKey()`.

```javascript
// payloadSupport is true when supported, false otherwise.
const payloadSupport = 'getKey' in PushSubscription.prototype;
```

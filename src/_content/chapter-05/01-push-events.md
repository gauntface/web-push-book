---
title: Push Events
---
# Push Events

By this point we have have a used subscribing for push, sending the
subscription our server and then sending a message to our users. The next
step is to receive this push and display a notification.

## The Push Event

When a message is received, it'll be received in your service worker, we
briefly mentioned it earlier in the book.

A service worker is a special JavaScript file, but its still just a JavaScript
file so defining a `push` event listener is no different to defining a listener
for any other event.

<% include('./code-samples/push-event-only.js') %>

The weirdest bit of this code when I first saw it was the `self` variable. This
is actually a common thing in Web Workers, which a service worker is. `self`
references the global scope, kind of like `window` is in a web page.

Here we are simply saying, when this service worker receives a push event,
please call this callback, and in the sample we look for data and print it
out to the console.

There are other ways you can parse the data from push event:

```javascript
// Returns string
event.data.text()

// Parses data as JSON string and returns an Object
event.data.json()

// Returns blob of data
event.data.blob()

// Returns an arrayBuffer
event.data.arrayBuffer()
```

Most people use `json()` or `text()` depending on their app.

That is the bare bones of the push event. Nice and easy. No matter whether your
web app is open or not, the browser will wake up your service worker and
dispatch a push event for you to handle. There is one thing to be careful
of and thats how you use `event.waitUntil()`.

### Wait Until

One of the things to understand about service workers is that you have little
control over when the service worker code is running. The browser decides when
to wake it up and when to terminate it. The only way you can tell the browser,
"Hey I'm super busy doing important stuff", is to pass a promise into the
`event.waitUntil()` method.

With push events this has a little extra requirement. Before the promise you
pass in has resolved, you must have shown a notification.

Here's the most basic example of showing a notification:

<% include('./code-samples/notification-wait-until.js') %>

Calling `self.registration.showNotification()` is the method that displays
a notification to the user and returns a promise which resolves once it's done.
This promise is assigned to the variable `promiseChain` which is then passed
into `event.waitUntil()`. This is very verbose, but I've seen a number of
issues that have revolved under mis-understanding what should be passed
into *waitUntil()* or simply broken promise chains.

A more complicated example with network request for data and analytics event
could look like this:

<% include('./code-samples/complex-notification-sample.js') %>

Here we are calling a function that returns a promise `pushReceivedTracking()`
and also making a network request, getting the response and showing a
notification. We make sure the service worker is kept alive by combining
these promises with a promise from *promise.all()*. It's this promise
that we pass into `event.waitUntil()` meaning the browser will  wait until
both promises have finished before checking for a notification and terminating
the service worker.

> **Tip:** If you ever find your promise chains confusing or a little messy
> I find that breaking things into functions help to reduce complication.
> I'd also recommend
> [this blog post by Philip Walton on untangling promise chains](https://philipwalton.com/articles/untangling-deeply-nested-promise-chains/).
> The main point to take away is to play around with promises and experiment
> with how they can be written to find a style that works for you.

The reason we should be concerned about waitUntil and using it correctly is
that one of the most common issues developers when implementing push is when
they get this default notifcation shown by Chrome.

![An Image of the default notification in Chrome](/images/default-notification-mobile.png)

Chrome will show the notification:

> This site has been updated in the background.

When a push is received but the push event in the service worker **does not**
show a notification after the promise passed to *event.waitUntil()* has
finished.

The main reason developers get caught out by this is that their code will
often call *self.registration.showNotification()* but they **aren't** doing
anything with the promise it returns, resulting in sometimes the notification
displaying in time and other times it doesn't, resulting in the notifcation
above. Just rememeber - you see that notification, check your promise chains
and *event.waitUntil()*.

Time to actually look at notification styles.

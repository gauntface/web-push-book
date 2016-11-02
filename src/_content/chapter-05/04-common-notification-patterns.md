---
title: Common Notification Patterns
---
# Common Notification Patterns

In this chapter we're going to look at some of the actions or behaviors you can
bake into your web app when a notification is clicked.

This will be using a number of API's that are available in the service worker.

## Notification Click Event

When a user clicks on a notification the default behaviour is for nothing
to happen, but the common practice is for the notification to close and
perhaps perform some other logic (i.e. open a window or make some API
call that will do some remotely).

To this, we just need to define a 'notificationclick' event listener
that will be called when ever a notification is clicked.

<% include('../../demo/web-app/service-worker.js', 'simpleNotification') %>

From this we can access the notification via 'event.notification'.

## Notification Close Event

This event isn't particularly useful for many things, but it is super helpful
for analytics to detect if a user has dismissed your notification vs interacted
with it.

It's the same as the `notificationclick` event, just a different event name:

<% include('../../demo/web-app/service-worker.js', 'notificationCloseEvent') %>

## The Exception to Showing a Notification

Throughout this book I've been stating that you **must** show a notification
when you receive a push and this is true *except* for one scenario, at least
until the [Budget API](https://beverloo.github.io/budget-api/) is spec'd and
implemented.

The exception is that *if* the user has your site open and currently focused,
you don't have to show a notification.

You could basically use the following code to detect if you need to
show a notification or not:

<% include('../../demo/web-app/notification-behavior/service-worker.js', 'showNotificationRequired') %>

When a push message is received we would get the current window clients,
check if any of the window clients are focused and if one of them is, we don't
need to show a notification.

## Open a Window

One of the most common actions of clicking on a notification is to open a
window and the code for this is very simple.

<% include('../../demo/web-app/notification-behavior/service-worker.js', 'notificationOpenWindow') %>

There are few scenarios that this ignores:

1. What happens if that page is already open?
1. What happens if the user is offline by the time they click on the
notification?

## Focus an Existing Window

Instead of always opening a new window, we should focus on a window if it's
currently open and open a new window if it's not open.

Before we look at how to achieve this, it's worth highlighting that this is
**only possible for your origin**. That means that we can only get a list of
URL's that are currently open for URL's that are for your website. The reason
for this is to stop developers from being able to see what sites people are
visiting.

Taking the previous example where we open
'/notification-behavior/example-page.html', and this time focus on an open tab
otherwise open a new one.

<% include('../../demo/web-app/notification-behavior/service-worker.js', 'notificationFocusWindow') %>

Let's step through the code.

First we get a list of the "WindowClients", which are just a list of tabs /
windows currently open (remember this if tabs for your origin only).

<% include('../../demo/web-app/notification-behavior/service-worker.js', 'clientsMatchAll') %>

The options passed into `matchAll` just inform the browser that we only want
to search for 'window' type clients (i.e. tabs and windows, not web workers).
`includeUncontrolled` is to search to tabs that aren't controlled by the
service worker the code is running in. Generally, you'll always want this to
be true for this use case.

We capture the returned promise as `promiseChain` so we can pass it into
`event.waitUntil()`, keeping our service worker alive.

When the `matchAll()` promise resolves, we iterate through the results comparing
the clients URL to the URL we want to open. If we find a match we call
`matchingClient.focus()`. If we can't find a matching client then we
open a new window, same as in the previous section.

<% include('../../demo/web-app/notification-behavior/service-worker.js', 'searchClients') %>

**Note:** We are returning the promise for `matchingClient.focus()` and
`clients.openWindow()` so that the promises are accounted for in our promise
chain.

## Cache a Page and Open Window

// TODO: Simple example of caching a page ahead of displaying the notification.

## Adding Data to a Notification

When a push message is received it's common to want to take data / information
you have from the push event and access it when the user actually clicks
the notification.

The easiest way to do this is to add data to a notification in the options for
`showNotification()` like this:

<% include('../../demo/web-app/notification-behavior/notification-behavior.js', 'addNotificationData') %>

Then, inside your click handler you can get the notification, and it's data,
with `event.notification.data`.

<% include('../../demo/web-app/notification-behavior/service-worker.js', 'printNotificationData') %>

## Merging notifications

We saw that adding a tag to a notification opts in to a behavior where any
existing notification with the same tag is replaced.

What happens if you wanted to do something a bit more sophisticated, like a
chat app, where a new notification from a contact shows "You have 2 messages
from X" rather than just showing the latest message.

You can do this, or manipulate current notifications in other ways, with
`registration.getNotifications()` which returns a promise that resolves to
the currently visible notifications from your web app.

First let's look at how we can get the currently opened notifications and loop
through to pick out an existing notification:

<% include('../../demo/web-app/notification-behavior/notification-behavior.js', 'getNotifications') %>

A call to `getNotifications()` and a for loop to step through each notification,
here we are looking for a parameter in the notifications data, but this could be
a tag or anything else that is meaningful to your app.

Next step is to replace the notification.

In the example of a fake message app, we can track the number of new messages
in our notifications data and then increase them with each new notification.

<% include('../../demo/web-app/notification-behavior/notification-behavior.js', 'manipulateNotification') %>

This code checks if for the new notification and if it exists it bumps the
message count and changes the notification title and body message. If there
were no notifications, it simply creates a new notification with a
`newMessageCount` of 1.

The end result is that the first message would look like this:

![First notification without merging.](/images/notification-screenshots/desktop/merge-notification-first.png)

If a second notification was shown before the previous notification was closed,
then we can collapse the notifications resulting in:

![Second notification with merging.](/images/notification-screenshots/desktop/merge-notification-second.png)

The nice thing with this approach is that if your user witnesses the
notifications appearing one over the other, it'll look / feel more cohesive
than just replacing with the latest message.

## Message Page from a Push Event

Since we've just seen when and how to detect that one of your pages is focused,
meaning you don't need to show a notification, it may still be useful to send
information from your service worker to your pages so they can show something
to the user (i.e. a small notification tray could show a badge).

In your service worker, when you receive a push, you could make a similar check
for a focused window to see if we need to show a notification or not. If we
don't need to show a notification then we can "post a message" to each open
page, like this:

<% include('../../demo/web-app/notification-behavior/service-worker.js', 'sendPageMessage') %>

In our pages, we can listen for this messages by adding a message event
listener:

<% include('../../demo/web-app/notification-behavior/notification-behavior.js', 'swMessageListener') %>

In this message listener you could do anything you want, show a toast, a
notification bubble or completely ignore the message.

If you don't define a message listener then the messages from the service worker
will simply not do anything.

---
title: FAQ
---
# FAQ

## Why Doesn't Push Work when the Browser is Closed?

This question crops up quite a bit, largely because there are a few scenarios that make it difficult to reason with / understand.

Let's start with Android. The Android OS is designed to listen for push messages and upon receiving a push message, wake up the appropriate Android app to handle the push message, regardless of whether the app is closed or not.

This is exactly the same with any browser on Android, the browser will be woken
up when a push message is received and the browser will then wake up your
service worker and dispatch the push event.

On desktop OS's, it's more nuanced and it's easiest to explain on Mac OS X
because there is a visual indicator to help explain the different scenarios.

On Mac OS X, you can tell if a program is running or not by a marking
under the app icon in the dock.

If you compare the two Chrome icons in the following dock, the one on the left
is running, illustrated by the marking under the icon, where as the Chrome
on the right is **not running**, hence the lack of the marking underneath.

![Example of OS X](/images/faq/os-x-dock.png){: .center-image }

In the context of receiving push messages on desktop, you will receive messages
when the browser is running, i.e. has the marking underneath the icon.

This means the browser can have no windows open, and you'll still receive the push message in your service worker, because the browser in running in the background.

The only time a push won't be received is if the browser is completely closed, i.e. not running at all - no marking. The same applies for Windows, although it's a little trickier to determine whether Chrome is running in the background or not.

## How Do I Make My Homescreen Web App Open Fullscreen from a Push?

On Chrome for Android, a web app can be added to the home screen and when the web app is opened from the homescreen, it can launch in a fullscreen mode without the URL bar, as shown below.

![Homescreen Icon to Fullscreen](/images/faq/gauntface-homescreen-to-fullscreen.png){: .center-image }

To keep this experience consistent, developers want their notifications clicked to open their web app in fullscreen as well.

Chrome "sort of" implemented support for this, although you may find it unreliable / hard to reason with. The relevant implementation detail is as follows:

> Sites which have been added to homescreen on Android should be
> allowed to open in standalone mode in response to push notifications. As
> Chromium cannot detect what sites are on the homescreen after they
> have been added, the heuristic is sites which have been launched from
> homescreen within the last ten days will be opened in standalone from
> a tap on a notification.
> --[Chrome Issue](https://bugs.chromium.org/p/chromium/issues/detail?id=541711)

What this means is that unless your user is visiting your site through the home screen icon fairly regularly, your notifications will open in the normal browser UI.

This issue will be worked on further.

**Note:** This is just the behavior of Chrome, other browsers may do different things as well. Feel free to [raise an issue](https://github.com/gauntface/web-push-book/issues) if you have anything you think should be mentioned with this question.

## Why is this Any Better than Web Sockets?

The reason web push is preferable is that a service worker can be brought to
life, when the browser window is closed. A web socket will only live as long as the browser and web page is kept open.

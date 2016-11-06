---
title: FAQ
---
# FAQ

## Why Doesn't Push Work when the Browser is Closed?

This question crops up quite a bit, largely because there are a few scenarios.

Let's start with Android. The Android mobile platform is designed to listen
for push messages and upon receiving a push message, it'll wake up an Android
app to handle the push message regardless of whether the app is closed or not.

This is exactly the same with a browser on Android, the browser will be woken
up when a push message is received and the browser will then wake up your
service worker and dispatch the push event.

On desktop OS's, it's nuanced and probably easiest to explain on Mac OS X
because there is a visual indicator to help explain.

On Mac OS X, you can tell if a program is running or not by a marking
under the app icon in the dock.

If you compare the two Chrome icons in the following dock, the one on the left
is running, highlighted by the marking under the icon, where as the Chrome
on the right is **not running**, hence the lack of the marking underneath.

![Example of OS X](/images/faq/os-x-dock.png){: .center-image }

In the context of receiving push messages on desktop, you will receive messages
when the browser is running, i.e. has the marking underneath the icon.

This means the browser can actually be completely closed, i.e. no windows open,
and you'll still receive the push message in your service worker.

The only time you won't receive your push immediately is if the browser is
*not running*, i.e. no marking. The same applies for Windows, although it's
a little trickier to determine whether Chrome is running in the background or
not.

### How Do I Avoid Lots of Pushes When The Browser Opens?

// TODO: Research lots of pushes arrive on the browser and how it's handled
in terms of push events.

## How Do I Make My Homescreen Web App Open Fullscreen from a Push?

On Chrome for Android a web app can be added to the home screen and when
the web app is opened from the homescreen, it can launch in a fullscreen
mode without the URL bar, as shown below.

![Homescreen Icon to Fullscreen](/images/faq/gauntface-homescreen-to-fullscreen.png){: .center-image }

To keep this experience consistent, developers want their notifications that
result in opening their web app, to be opened in fullscreen as well.

Chrome implemented "sort of" support for this, although I've found it
difficult to reliably work with, the reason of which can be found in [this issue
on Chrome's issue tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=541711),
specifically this:

> Sites which have been added to homescreen on Android should be
> allowed to open in standalone mode in response to push notifications. As
> Chromium cannot detect what sites are on the homescreen after they
> have been added, the heuristic is sites which have been launched from
> homescreen within the last ten days will be opened in standalone from
> a tap on a notification.

What this means is that unless your user is visiting your site fairly regularly,
chances are your notifications will open in the normal browser UI.

**Note:** This is just the behavior of Chrome, other browsers may do different
things as well. Feel free to [raise an issue](https://github.com/gauntface/web-push-book/issues)
if you have anything you think should be mentioned with this question.

## Why is this Any Better than Web Sockets?

The reason this is preferable is because a service worker can be brought to
life, even when the browser is closed. Compared to a web socket, which will
only be kept alive as long as the browser and your web page is kept open.

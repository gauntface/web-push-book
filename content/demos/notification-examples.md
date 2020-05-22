---
title: Notification Examples
description: |
  This is a set of example notifications that are referenced throughout
  the web push book content.
---
## Notification Options

This page contains a set of example notifications that you can interact
with to see what is possible with notifications.

Clicking on the buttons below will show one notification to
demonstrate a particular options in the notification API.

If you just want to see what a notification looks like in your browser
with **all** the UI options set, click the button below.

<p class="demo-btns">
  <button class="c-button js-notification-overview" disabled>Example Notification</button>
</p>

The buttons will be enabled if the browser has support for the feature
being demonstrated. If the button is grey, then it's not supported on
your browser.

### Desktop &amp; Mobile

The following examples are known to work on both Desktop and Mobile in
Chrome.

###### Title & Body

Basic example of a notification with a basic title and body.

<p class="demo-btns">
  <button class="c-button js-notification-title-body" disabled>Title &amp; Body</button>
  <button class="c-button js-notification-long-title-body" disabled>Long Title &amp; Body</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#title-and-body-options">Details &amp; Code</a>
</p>

###### Notification Icon

The icon on a notification is the image to the left of the title and
body text.

<p class="demo-btns">
  <button class="c-button js-notification-icon" disabled>Icon</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#icon">Details &amp; Code</a>
</p>

###### Notification Image

A notification image should be used to display a larger image in the the
main body of the notification. At the time of writing this is behind the
experimental web platform feature in Chrome and the results vary between
Android and Desktop.

<p class="demo-btns">
  <button class="c-button js-notification-image" disabled>Image</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#image">Details &amp; Code</a>
</p>

###### Action Buttons

Actions allow you to add buttons to a notification so multiple
actions can be performed by your user.

At the time of writing, Android will make the icons (if defined)
a color that matches the current UI. Desktop Chrome will display the icon
as is.

<p class="demo-btns">
  <button class="c-button js-notification-actions" disabled>Actions</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#actions">Details &amp; Code</a>
</p>

###### Language Direction
You can set a "dir" option to indicate if the test should be displayed
"left-to-right" or "right-to-left".

<p class="demo-btns">
  <button class="c-button js-notification-dir-ltr" disabled>Direction: LTR</button>
  <button class="c-button js-notification-dir-rtl" disabled>Direction: RTL</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#direction">Details &amp; Code</a>
</p>

###### Tag
Defining a tag for a notification means that when a new Notification
is shown with the same tag, any old notifications with that tag are
removed before the new notification is shown.

<p class="demo-btns">
  <button class="c-button js-notification-tag" disabled>Tag</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/03-notification-behaviour/#tag">Details &amp; Code</a>
</p>

###### Renotify

When you use the tag option, the default behavior of a new notification
replacing an existing one is that there is no sound, vibration and the
screen is kept asleep.

With `renotify: true` a new notification will play a sound, vibrate
and wake up the users device. This means replacing notifications have
the same behavior as a completely new notification.

*Note:* There is no
visible affect on desktop, but on mobile, vibration and sound will be
affected.

<p class="demo-btns">
  <button class="c-button js-notification-renotify" disabled>Renotify</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/03-notification-behaviour/#renotify">Details &amp; Code</a>
</p>

###### Silent

When a new notification arrives, by default, it plays a sound, vibrates
and wakes up the screen. Setting the silent parameter means that
the notification is displayed, but there is none of the default behaviors
like sound, vibration and screen wake.

<p class="demo-btns">
  <button class="c-button js-notification-silent" disabled>Silent</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/03-notification-behaviour/#silent">Details &amp; Code</a>
</p>

###### Require Interaction
On desktop, a notification is only displayed for a short period of time.
On Android, notifications are shown until the user interacts with it.

To get the same behaviour on desktop and mobile you can set the
"require-interaction" option to true, which means the user
**must** click or dismiss the notification.

<p class="demo-btns">
  <button class="c-button js-notification-require-interaction" disabled>Require Interaction</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/03-notification-behaviour/#requires-interaction">Details &amp; Code</a>
</p>


### Mobile Only

These fields aren't *strictly* mobile only. A desktop browser
*could* use these fields if it want to, but at the moment
they don't. For this reason, you'll need to use a mobile device to
see what the options do.

###### Notification Badge

Notification badges are only being used on mobile, at least at the time
of writing. It's used to replace the browser icon that is shown by default.

<p class="demo-btns">
  <button class="c-button js-notification-badge" disabled>Badge</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#badge">Details &amp; Code</a>
</p>

###### Vibration

You can define a pattern of vibrations to make a tune. This only
applies to mobile devices since laptops tend not to vibrate.

<p class="demo-btns">
  <button class="c-button js-notification-vibrate" disabled>Vibrate</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#vibrate">Details &amp; Code</a>
</p>

### Other Options

###### Timestamp

At the time of writing, there is no visible affect to notifications
with a custom timestamp.

<p class="demo-btns">
  <button class="c-button js-notification-timestamp" disabled>Timestamp</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#timestamp">Details &amp; Code</a>
</p>

###### Sound

The sound option has been defined, but at the time of writing no browser
has implemented it yet.

<p class="demo-btns">
  <button class="c-button js-notification-sound" disabled>Sound</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/02-display-a-notification/#sound">Details &amp; Code</a>
</p>

## Notification Common Practices

The following links are examples of common patterns on the web.
For example, a common use case is for a web page to be opened when
a user clicks on a notification.

###### Open a Window

This example simply demonstrates opening a URL after the user has
clicked on a notification.

<p class="demo-btns">
  <button class="c-button js-open-window" disabled>Open Window</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/04-common-notification-patterns/#open-a-window">Details &amp; Code</a>
</p>

###### Focus a Window or Open

This example is similar to "Open a Window", except that it checks
if there is already a window open at that URL and if not, it opens
it.

To see this, try clicking the button below, then clicking the
notification to open a new window. Repeat clicking the button and
notification and notice that the originally open window will be
focused rather than open a new window.

<p class="demo-btns">
  <button class="c-button js-focus-window" disabled>Focus a Window OR Open</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/04-common-notification-patterns/#focus-an-existing-window">Details &amp; Code</a>
</p>

###### Adding Data to a Notification

This is a trivial example. When the notification is shown it is given
a `data` parameter in the `showNotification()`
options. When the notification is clicked, it prints this data to the
console.

This data attribute is incredibly useful for passing information
from the time when a notification is shown, to when a notification is
clicked.

<p class="demo-btns">
  <button class="c-button js-data-notification" disabled>Adding Data to Notification</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/04-common-notification-patterns/#adding-data-to-a-notification">Details &amp; Code</a>
</p>

###### Merging Notifications Programmatically

In the `tag` example above, we saw how it affects
multiple notifications being shown (i.e. replacing notifications with
the same tag). But there may be scenarios where you want to manage
the merging / collapsing of notifications with custom logic.

This example demonstrates how notifications can be iterated over and
then have their data collapsed.

Click the button multiple times and close / click the notifications
to see what it does.

<p class="demo-btns">
  <button class="c-button js-merge-notification" disabled>Merge Notification</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/04-common-notification-patterns/#merging-notifications">Details &amp; Code</a>
</p>

###### Must show a Notification

Throughout the [Web Push
Book](https://web-push-book.gauntface.com) there are references to "having to show a notification". This is
*almost* completely true. The one scenario where you
**don't** need to show a notification is if the user
is currently looking at your site.

This example waits for 4 seconds and then iterates over the current
windows for this site, checking to see if one of them is *focused*.
If one is, we print a message to the console, otherwise we show a
notification.

<p class="demo-btns">
  <button class="c-button js-must-show-notification" disabled>Must Show Notification (4s Delay)</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/04-common-notification-patterns/#the-exception-to-showing-a-notification">Details &amp; Code</a>
</p>

###### Send a Message to the Page

Once a notification is received you may want to send data to any
of pages that are currently open. This example will wait 4s before
triggering a fake push event. Then the push event will post a message
to the page, which is printed to the console.

<p class="demo-btns">
  <button class="c-button js-send-message-to-page" disabled>Send Message to Page (4s Delay)</button>
  <a class="c-button c-button--no-bg" href="/chapter-05/04-common-notification-patterns/#message-page-from-a-push-event">Details &amp; Code</a>
</p>

<script src="/demos/notification-examples/notification-examples.js"></script>
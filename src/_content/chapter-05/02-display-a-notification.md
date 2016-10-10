---
title: Displaying a Notification
---
# Displaying a Notification

I've split up notification options into two sections, one that deals with
the visual aspects (this one) and one that explains the behavioural aspects
of notifications.

The reason for this is that every developer will need to be worried about the
visual aspects but the behavioural aspects will be more detailed and more
specific to your use case.

## Visual Options

The API for showing a notification is simply:

    <ServiceWorkerRegistration>.showNotification(<title>, <options>);

Where the title is a string and options can be the following:

```
{
  "//": "Visual Options",
  body: <String>,
  icon: <URL String>,
  image: <URL String>,
  badge: <URL String>,
  vibrate: <Array of Integers>,
  sound: <URL String>,
  dir: <String of 'auto' | 'ltr' | 'rtl'>,

  "//": "Behavioural Options",
  tag: <String>,
  data: <Anything>
  requireInteraction: <boolean>,
  renotify: <Boolean>,
  silent: <Boolean>,
  noscreen: <Boolean>,
  sticky: <boolean>,

  "//": "Both Visual & Behavioural Options",
  actions: <Array of Strings>

  "//": "???????????????",
  timestamp: <Long>
}
```

First let's look at the visual options.

![Dissection of the UI of a Notification](/images/notification-ui.png)

### Title and Body Options

The Title and body options are exactly as they sound, two different pieces of text to display on the notification.

With the following code:

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'titleAndBodySimple') %>

We'll get the following notification:

![Notification with Title and Body Text on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-title-body.png)

Firefox on Linux will have this look:

![Notification with Title and Body Text on Firefox on Linux.](/images/notification-screenshots/desktop/firefox-title-body.png)

If we add too much desktop Chrome will truncate the text.

![Notification with Long Title and Body Text on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-long-title-body.png)

Interestingly with Firefox on Linux the body text is collapsed until you hover it, causing the notification to expand.

The following images are of the longer pieces of text for title and body with before and after hovering the notification.

![Notification with Long Title and Body Text on Firefox on Linux.](/images/notification-screenshots/desktop/firefox-long-title-body.png)

![Notification with Long Title and Body Text on Firefox on Linux while hovering over the notification with the mouse cursor.](/images/notification-screenshots/desktop/firefox-long-title-body-expanded.png)

### Icon

The "icon" option is essentially a small image you can show next to the title and body text.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'iconNotification') %>

On Chrome we get this notification on Linux:

![Notification with Icon on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-icon.png)

and on Firefox:

![Notification with Icon on Firefox on Linux.](/images/notification-screenshots/desktop/firefox-icon.png)

Sadly there aren't any solid guidelines for what size image to use for an icon.

[Android seems to want a 64dp image](http://stackoverflow.com/questions/7220738/honeycomb-notifications-how-to-set-largeicon-to-the-right-size) (which is 64px x device pixel ratio).

Given the highest pixel ratio for a device 3, an icon size of >= 192px is a safe bet.

### Badge

The badge is a small monochrome icon that is generally used when your icon is collapsed.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'badgeNotification') %>

The badge is only used on Chrome for Android at the time of writing.

![Notification with Badge on Chrome for Android.](/images/notification-screenshots/mobile/chrome-badge.png)

On other browsers (or Chrome without the badge), you'll see an icon of the browser.

![Notification with Badge on Firefox for Android.](/images/notification-screenshots/mobile/firefox-badge.png)

As with the icon, there are no real guidelines on what size to use.

Digging through [Android guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_status_bar.html) the recommended size is 24px x device pixel ratio.

Meaning an image of >= 72px should be good.

### Image

The "image" option can be used to display a large image to the user. This is particularly useful to display a preview of an image to the user.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'imageNotification') %>

On desktop the notification will look like this:

![Notification with Image on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-image.png)

On Android the ratio is different.

![Notification with Image on Chrome for Android.](/images/notification-screenshots/mobile/chrome-image.png)

Given the differences in ratio between desktop and mobile it's extremely hard to suggest guidelines.

Since desktop doesn't fill the available space and has a ratio of 4:3 on Chrome, perhaps that is the best approach to take, allowing Android to crop the image.

On Android, the only [guideline width](https://code.google.com/p/android/issues/detail?id=36744) I could find was a width of 450dp.

An image of width >= 1350px would be a good bet.

### Vibrate

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'vibrateNotification') %>

// On Android you must have volume up to some extent
// Doesn't do anything on desktop

### Actions

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'actionsNotification') %>

// Android N doesnt use Icons
// Android M does use icons and colors them
// Desktop uses icons but doesn't color them

### Direction

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'dirRTLNotification') %>

// Language plays a big part of this and setting `dir` is just a hint.

// Can be auto, ltr or rtl

### Sound

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'soundNotification') %>

// Not implemented in Chrome?
// TODO: implemented in FF?

## UX Best Practices

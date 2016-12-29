---
title: Displaying a Notification
---
# Displaying a Notification

I've split up notification options into two sections, one that deals with
the visual aspects (this one) and one that explains the behavioural aspects
of notifications.

The reason for this is that every developer will need to be worried about the
visual aspects but the behavioural aspects will depend on your
specific to your use case.

All of the source code for these demo's is taken from a demo page. If you want
to test them out for yourself, just click the button below.

<a class="button" href="/demos/notification-examples/">Notification Demos</a>

## Visual Options

The API for showing a notification is simply:

    <ServiceWorkerRegistration>.showNotification(<title>, <options>);

Where the title is a string and options can be the following:

```
{
  "//": "Visual Options",
  "body": "<String>",
  "icon": "<URL String>",
  "image": "<URL String>",
  "badge": "<URL String>",
  "vibrate": "<Array of Integers>",
  "sound": "<URL String>",
  "dir": "<String of 'auto' | 'ltr' | 'rtl'>",

  "//": "Behavioural Options",
  "tag": "<String>",
  "data": "<Anything>",
  "requireInteraction": "<boolean>",
  "renotify": "<Boolean>",
  "silent": "<Boolean>",
  "noscreen": "<Boolean>",
  "sticky": "<boolean>",

  "//": "Both Visual & Behavioural Options",
  "actions": "<Array of Strings>",

  "//": "Doesn't seem to affect any visual aspect of the notification.",
  "timestamp": "<Long>"
}
```

First let's look at the visual options.

![Dissection of the UI of a Notification](/images/notification-ui.png){: .center-image }


### Title and Body Options

The Title and body options are exactly as they sound, two different pieces of text to display on the notification.

With the following code:

<% include('../../demos/notification-examples/notification-examples.js', 'titleAndBodySimple') %>

We'll get the following notification:

![Notification with Title and Body Text on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-title-body.png){: .center-image }

Firefox on Linux will have this look:

![Notification with Title and Body Text on Firefox on Linux.](/images/notification-screenshots/desktop/firefox-title-body.png){: .center-image }

If we add too much desktop Chrome will truncate the text.

![Notification with Long Title and Body Text on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-long-title-body.png){: .center-image }

Interestingly with Firefox on Linux the body text is collapsed until you hover it, causing the notification to expand.

The following images are of the longer pieces of text for title and body with before and after hovering the notification.

![Notification with Long Title and Body Text on Firefox on Linux.](/images/notification-screenshots/desktop/firefox-long-title-body.png){: .center-image }

![Notification with Long Title and Body Text on Firefox on Linux while hovering over the notification with the mouse cursor.](/images/notification-screenshots/desktop/firefox-long-title-body-expanded.png){: .center-image }

### Icon

The "icon" option is essentially a small image you can show next to the title and body text.

<% include('../../demos/notification-examples/notification-examples.js', 'iconNotification') %>

On Chrome we get this notification on Linux:

![Notification with Icon on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-icon.png){: .center-image }

and on Firefox:

![Notification with Icon on Firefox on Linux.](/images/notification-screenshots/desktop/firefox-icon.png){: .center-image }

Sadly there aren't any solid guidelines for what size image to use for an icon.

[Android seems to want a 64dp image](http://stackoverflow.com/questions/7220738/honeycomb-notifications-how-to-set-largeicon-to-the-right-size) (which is 64px x device pixel ratio).

Given the highest pixel ratio for a device 3, an icon size of >= 192px is a safe bet.

### Badge

The badge is a small monochrome icon that is generally used when your icon is collapsed.

<% include('../../demos/notification-examples/notification-examples.js', 'badgeNotification') %>

The badge is only used on Chrome for Android at the time of writing.

![Notification with Badge on Chrome for Android.](/images/notification-screenshots/mobile/chrome-badge.png){: .center-image }

On other browsers (or Chrome without the badge), you'll see an icon of the browser.

![Notification with Badge on Firefox for Android.](/images/notification-screenshots/mobile/firefox-badge.png){: .center-image }

As with the icon, there are no real guidelines on what size to use.

Digging through [Android guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_status_bar.html) the recommended size is 24px x device pixel ratio.

Meaning an image of >= 72px should be good.

### Image

The "image" option can be used to display a large image to the user. This is particularly useful to display a preview of an image to the user.

<% include('../../demos/notification-examples/notification-examples.js', 'imageNotification') %>

On desktop the notification will look like this:

![Notification with Image on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-image.png){: .center-image }

On Android the ratio is different.

![Notification with Image on Chrome for Android.](/images/notification-screenshots/mobile/chrome-image.png){: .center-image }

Given the differences in ratio between desktop and mobile it's extremely hard to suggest guidelines.

Since desktop doesn't fill the available space and has a ratio of 4:3 on Chrome, perhaps that is the best approach to take, allowing Android to crop the image.

On Android, the only [guideline width](https://code.google.com/p/android/issues/detail?id=36744) I could find was a width of 450dp.

An image of width >= 1350px would be a good bet.

### Actions

Actions allow you to define buttons that are displayed with the notification and can be interacted with by the user.

<% include('../../demos/notification-examples/notification-examples.js', 'actionsNotification') %>

At the time of writing only Chrome and Opera for Android support actions.

![Notification with Actions on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-actions.png){: .center-image }

For each action you can define a title, an "action" (which is essentially an ID) and an icon.

I've defined 4 actions in the sample code above to illustrate that you can
define more actions than will be displayed. If you want to know the number
actions that will be displayed ahead of time you can check using
`Notification.maxActions`.

In the image above the icons are colored differently. The coffee icon is colored to match the text of Chrome's text, #333333, while the doughnut icon is bright pink.

Why do two colors? Because on Android Marshmallow the icons colored to match the system like so:

![Notification with Actions on Chrome for Android.](/images/notification-screenshots/mobile/chrome-actions-m.png){: .center-image }

In Android Nougat the action icons aren't shown at all.

It's also worth calling out that that icons look crisp on Android but **not** on desktop.

The best size I could get to work on desktop Chrome was 24px x 24px. This sadly looks out of place on Android.

The best practice we can draw from this:

- Stick to a consistent color scheme for your icons as it may be displayed to the user.
- Make sure they look work in monochrome as some platforms may display them in such a way.
- Test the size and see what works for you. 128px x 128px works well on Android for me but was poor quality on desktop.
- Expect your icons not to be displayed at all.

### Direction

The "dir" parameter allows you to say what direction the text should be displayed, right-to-left or left-to-right.

In testing it seemed that the direction was largely determined by the text rather than this parameter. Reading through the spec it calls out this can be used to suggest to the browser how to layout options like actions, but I saw no difference.

Probably best to define if you can, otherwise the browser should do the right thing.

<% include('../../demos/notification-examples/notification-examples.js', 'dirRTLNotification') %>

The parameter should be set to either `auto`, `ltr` or `rtl`.

A right-to-left language used on Chrome on Linux looks like this:

![Notification with Right-to-Left Language on Chrome on Linux.](/images/notification-screenshots/desktop/chrome-rtl.png){: .center-image }

On Firefox (while hovering over it) you'll get this:

![Notification with Right-to-Left Language on Firefox on Linux.](/images/notification-screenshots/desktop/firefox-rtl-expanded.png){: .center-image }

### Vibrate

The vibrate option allows you to define a vibration pattern on a user's devices when the notification is received, assuming the user's current settings allow for vibrations.

The format of the vibrate option should be an
array of numbers that describe the number of milliseconds the device should vibrate followed by the number of milliseconds the device should *not* vibrate.

<% include('../../demos/notification-examples/notification-examples.js', 'vibrateNotification') %>

This only affects devices that support vibration.

### Sound

The sound parameter allows you to define a sounds to play when the notification is received.

Sadly at the time of writing no browser has support for the sound option.

<% include('../../demos/notification-examples/notification-examples.js', 'soundNotification') %>

### Timestamp

Timestamp allows you to tell the platform the time the notification was intended for (i.e. when the event the notification relates to occured).

The timestamp should be the number of milliseconds since 00:00:00 UTC on
1 January 1970 (i.e. the unix epoch).

<% include('../../demos/notification-examples/notification-examples.js', 'timestampNotification') %>

## UX Best Practices

There are some [best practices over on the Google Developers site that you can check out](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/good-notification) but all I want to add to it is that you should consider why you sent the push message in the first place and make sure all of the above parameters are geared towards that reason.

To be honest, it's easy to see examples and think "I'll never make that mistake" but it's easier to fall into that trap than you might think.

1. Don't put your website in the title or the body. Browsers include your domain no matter what so **don't duplicate it**.
   Here's an example of Facebook doing this as a fallback message when you use the DevTools 'push' button. The important information is there's a new notification, not "Facebook".

    ![Screenshot of Facebook's Default Notification](/images/notification-screenshots/desktop/facebook-fallback-notification.png)

1. Use all information you have available to you. If you send a push message because someone sent a message to that user, rather than using a title of 'New Message' and body of 'Click here to read it.' use a title of 'John just sent a new message' and a body of part of the message.

    Here's a better example from Facebook (when there is an actual push message).

    ![Screenshot of a Facebook Message Notification](/images/notification-screenshots/desktop/facebook-message.png)  

    It has information on the user who sent the message, the message content and the users profile photo, making the notification more relevant to the user.

## Browsers and Features

At the time of writing there is a pretty big disparity between Chrome and Firefox in terms of feature support for notifications.

Luckily, you can feature detect support for notification features by looking at the notification prototype.

Let's say we wanted to know if a notification has support action buttons, we'd do the following:

    if ('actions' in Notification.prototype) {
      // Action buttons are supported.
    } else {
      // Action buttons are NOT supported.
    }

With this, we could change the notification we display to our users.

For other parameters you pass in to `showNotification`, just do the same as above, replacing 'actions' with the desired parameter names.

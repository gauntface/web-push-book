---
title: Displaying a Notification
weight: 8
---
# Displaying a Notification

I've split up notification options into two sections, one that deals with the visual aspects (this section) and one section that explains the behavioural aspects of notifications.

The reason for this is that every developer will need to be worried about the visual aspects but the behavioural aspects you'll use will depend how you use push notifications.

All of the source code for these demo's is taken from a demo page I put together. If you want to test them out for yourself then click the button below.

<a class="c-button" href="/demos/notification-examples/" target="\_blank">Notification Demos</a>

## Visual Options

The API for showing a notification is simply:

```
<ServiceWorkerRegistration>.showNotification(<title>, <options>);
```

Where the title is a string and options can be any of the following:

```json
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

  "//": "Both Visual & Behavioural Options",
  "actions": "<Array of Strings>",

  "//": "Information Option. No visual affect.",
  "timestamp": "<Long>"
}
```

First let's look at the visual options.

<p class="u-center">
  <img src="/images/notification-ui.png" alt="Dissection of the UI of a Notification" />
</p>

### Title and Body Options

The title and body options are exactly as they sound, two different pieces of text to display on the notification.

If we ran the following code:

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "titleAndBodySimple" >}}
```

We'd get this notification on Chrome:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/chrome-title-body.png" alt="Notification with title and body text on Chrome on Linux." />
</p>

On Firefox on Linux it would look like this:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/firefox-title-body.png" alt="Notification with title and body text on Firefox on Linux." />
</p>

I was curious about what would happen if I added lots of text and this was the result:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/chrome-long-title-body.png" alt="Notification with long title and body text on Chrome on Linux." />
</p>

Interestingly, Firefox on Linux collapses the body text until you hover the notification, causing the notification to expand.

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/firefox-long-title-body.png" alt="Notification with long title and body text on Firefox on Linux." />
</p>

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/firefox-long-title-body-expanded.png" alt="Notification with long title and body text on Firefox on Linux while hovering over the notification with the mouse cursor." />
</p>

The reason I've included these examples is twofold. There will be differences between browsers. Just looking at text, Firefox and Chrome look and act differently. Secondly there are differences across platforms. Chrome has a custom UI for all platforms whereas Firefox uses the system notifications on my Linux machine. The same notifications on Windows with Firefox look like this:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/firefox-title-body-windows.png" alt="Notification with title and body text on Firefox on Windows." />
</p>

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/firefox-long-title-body-windows.png" alt="Notification with long title and body text on Firefox on Windows." />
</p>

### Icon

The `icon` option is essentially a small image you can show next to the title and body text.

In your code you just need to provide a URL to the image you'd like to load.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "iconNotification" >}}
```

On Chrome we get this notification on Linux:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/chrome-icon.png" alt="Notification with ccon on Chrome on Linux." />
</p>

and on Firefox:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/firefox-icon.png" alt="Notification with tcon on Firefox on Linux." />
</p>

Sadly there aren't any solid guidelines for what size image to use for an icon.

[Android seems to want a 64dp image](http://stackoverflow.com/questions/7220738/honeycomb-notifications-how-to-set-largeicon-to-the-right-size) (which is 64px multiples by the device pixel ratio).

If we assume the highest pixel ratio for a device will be 3, an icon size of 192px or more is a safe bet.

> **Note**: Some browsers may require the image be served over HTTPS. Be aware of this if you intend to use a third-party image over HTTP.

### Badge

The `badge` is a small monochrome icon that is used to portray a little more information to the user about where the notification is from.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "badgeNotification" >}}
```

At the time of writing the badge is only used on Chrome for Android.

<p class="u-center">
  <img src="/images/notification-screenshots/mobile/chrome-badge.png" alt="Notification with badge on Chrome for Android." />
</p>

On other browsers (or Chrome without the badge), you'll see an icon of the browser.

<p class="u-center">
  <img src="/images/notification-screenshots/mobile/firefox-badge.png" alt="Notification with badge on Firefox for Android." />
</p>

As with the `icon` option, there are no real guidelines on what size to use.

Digging through [Android guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_status_bar.html) the recommended size is 24px multiplied by the device pixel ratio.

Meaning an image of 72px or more should be good (assuming a max device pixel ratio of 3).

### Image

The `image` option can be used to display a larger image to the user. This is particularly useful to display a preview image to the user.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "imageNotification" >}}
```

On desktop the notification will look like this:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/chrome-image.png" alt="Notification with image on Chrome on Linux." />
</p>

On Android the cropping and ratio are different.

<p class="u-center">
  <img src="/images/notification-screenshots/mobile/chrome-image.png" alt="Notification with image on Chrome for Android." />
</p>

Given the differences in ratio between desktop and mobile it's extremely hard to suggest guidelines.

Since Chrome on desktop doesn't fill the available space and has a ratio of 4:3, perhaps the best approach is to serve an image with this ratio and allow Android to crop the image. That being said, the `image` option is still new and this behavior may change.

On Android, the only [guideline width](https://code.google.com/p/android/issues/detail?id=36744) I could find is a width of 450dp.

Using this guideline, an image of width 1350px or more would be a good bet.

### Actions

You can defined `actions` to display buttons with a notification.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "actionsNotification" >}}
```

At the time of writing only Chrome and Opera for Android support actions.

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/chrome-actions.png" alt="Notification with actions on Chrome on Linux." />
</p>

For each action you can define a title, an "action" (which is essentially an ID) and an icon. The title and icon is what you can see in the notification. The ID is used when detecting that the action button had been clicked (We'll look into this more in the next section).

In the example above I've defined 4 actions to illustrate that you can define more actions than will be displayed. If you want to know the number actions that will be displayed by the browser you can check `Notification.maxActions`, which is used in the body text in the demo.

On desktop the action button icons display their colors (See the pink doughtnut above).

On Android Marshmallow the icons are colored to match the system color scheme:

<p class="u-center">
  <img src="/images/notification-screenshots/mobile/chrome-actions-m.png" alt="Notification with actions on Chrome for Android." />
</p>

Chrome will hopefully change it's behavior on desktop to match android (i.e. apply the appropriate color scheme to make the icons match the system look and feel). In the meantime you can match Chrome's text color by making your icons have a color of "#333333"..

On Android Nougat the action icons aren't shown at all.

It's also worth calling out that that icons look crisp on Android but **not** on desktop.

The best size I could get to work on desktop Chrome was 24px x 24px. This sadly looks out of place on Android.

The best practice we can draw from these differences:

- Stick to a consistent color scheme for your icons so at least all your icons have a consistent appearance.
- Make sure they work in monochrome as some platforms may display them that way.
- Test the size and see what works for you. 128px x 128px works well on Android for me but was poor quality on desktop.
- Expect your action icons not to be displayed at all.

The Notification spec is exploring a way to define multiple sizes of icons, but it looks like it'll be some time before anything is agreed upon.

### Direction

The "dir" parameter allows you to define which direction the text should be displayed, right-to-left or left-to-right.

In testing it seemed that the direction was largely determined by the text rather than this parameter. According to the spec this parameter is intended to suggest to the browser how to layout options like actions, but I saw no difference.

It's recommended to define `dir` if you can, although the browser should do the right thing according to the text supplied.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "dirRTLNotification" >}}
```

The parameter should be set to either `auto`, `ltr` or `rtl`.

A right-to-left language used on Chrome on Linux looks like this:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/chrome-rtl.png" alt="Notification with right-to-left language on Chrome on Linux." />
</p>

On Firefox (while hovering over the notification) you'll get this:

<p class="u-center">
  <img src="/images/notification-screenshots/desktop/firefox-rtl-expanded.png" alt="Notification with right-to-left language on Firefox on Linux." />
</p>

### Vibrate

The vibrate option allows you to define a vibration pattern that'll run when a notification is displayed, assuming the user's current settings allow for vibrations (i.e. the device isn't in silent mode).

The format of the vibrate option should be an array of numbers that describe the number of milliseconds the device should vibrate followed by the number of milliseconds the device should *not* vibrate.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "vibrateNotification" >}}
```

This only affects devices that support vibration.

### Sound

The sound parameter allows you to define a sound to play when the notification is received.

At the time of writing no browser has support for this option.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "soundNotification" >}}
```

### Timestamp

Timestamp allows you to tell the platform the time when an event occurred that resulted in the push notification being sent.

The `timestamp` should be the number of milliseconds since 00:00:00 UTC, which is 1 January 1970 (i.e. the unix epoch).

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "timestampNotification" >}}
```

## UX Best Practices

The biggest UX failure I've seen with notifications is a lack of specificity in the information displayed by a notification.

You should consider why you sent the push message in the first place and make sure all of the notification options are used to help users understand why they are reading that notification.

To be honest, it's easy to see examples and think "I'll never make that mistake". But it's easier to fall into that trap than you might think.

- Don't put your website in the title or the body. Browsers include your domain in the notification so **don't duplicate it**.

   Here's an example of Facebook's fallback message (you can use the DevTools 'push' button to display it yourself). Even if there is no data in the push, the important information is that there's a new notification, not "Facebook".

    ![Screenshot of Facebook's default notification](/images/notification-screenshots/desktop/facebook-fallback-notification.png)

- Use all information you have available to you. If you send a push message because someone sent a message to a user, rather than using a title of 'New Message' and body of 'Click here to read it.' use a title of 'John just sent a new message' and set the body of the notification to part of the message.

    Here's an example from a Facebook message.

    ![Screenshot of a Facebook message notification](/images/notification-screenshots/desktop/facebook-message.png)

    It contains information on who sent the message, the message content and the users profile photo, making the notification more relevant to the user.

## Browsers and Feature Detection

At the time of writing there is a pretty big disparity between Chrome and Firefox in terms of feature support for notifications.

Luckily, you can detect support for notification features by looking at the Notification prototype.

Let's say we wanted to know if a browser supports notification action buttons, we'd do the following:

```javascript
if ('actions' in Notification.prototype) {
  // Action buttons are supported.
} else {
  // Action buttons are NOT supported.
}
```

With this, we could change the notification we display to our users.

With the other options, just do the same as above, replacing 'actions' with the desired parameter name.

---
title: Notification Behaviour
---
# Notification Behaviour

Some of the options you pass into *showNotification*  alter the bhaviour
rather than the UI, like how multiple notifications should be treated.

Be default, calling `showNotification()` with just visual options will have
the following behaviours:

1. Each notification is shown, nothing is down in terms of collapsing
notifications.
1. Sound and Vibration may be played (depending on the platform).
1. The notification itself is clickable but nothing else.
1. On some platforms the notification will disappear after a short
period of time.

### Tag

The *tag* option is a essentially a String ID that "groups" notifications
together allowing an easy way to determine how multiple notifications
are displayed to the user. This is easiest to explain with an example.

Let's display a notification and give it a tag, a string ID, of
'message-group-1'.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'tagNotificationOne') %>

This will show our first notification.

![First notification with tag of message group 1.](/images/notification-screenshots/desktop/chrome-first-tag.png)

If we then display a second notification with a tag of 'message-group-2', we'll
get a second notification.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'tagNotificationTwo') %>

Here's our two notifications.

![Two notifications where the second tag is message group 2.](/images/notification-screenshots/desktop/chrome-second-tag.png)

Now if we show a new notification with a tag of 'message-group-1', the first
notification we displayed will go away and get replaced with this new, third
notification.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'tagNotificationThree') %>

Now we have 2 notifications even though we displayed called show 3
notifications.

![Two notifications where the first notification is replaced by a third notification.](/images/notification-screenshots/desktop/chrome-third-tag.png)

A subtlety to the notification tag is that by default the browser will replace
a notification with a new notification without the same sound and vibration
that you would get with the first notification. This is where `renotify` comes
in.

### Renotify

This largely applies to just mobile devices, making new notifications vibrate
and play a system sound.

There are scenarios where you might want a replacing notification to notify
the user, chat applications for example. In this case you just need to
set `renotify` to true.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'renotifyNotification') %>

// TODO Screenshot of first icon to two paths. One with Vibration + sound icon
// One with no sound of vibration icon.

Plesae note that renotify is **only used** when a notification is replacing
another notification due to matching tags.

If you set `renotify: true` on a notification without a tag, you'll get the
following error:

    TypeError: Failed to execute 'showNotification' on 'ServiceWorkerRegistration': Notifications which set the renotify flag must specify a non-empty tag

### Silent

This option allows you to show a new notification but prevent the default
behaviour of device vibration and sound.

This is ideal if your notification doesn't require immediate attention
from the user.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'silentNoficiation') %>

// TODO: Test if this causes the screen to wake up.

// TODO What happens if both renoty and silent are set?

### Requires Interaction

Most noticable on desktop is the time period in which a notification is
displayed before it's hidden. On Android the notifications are displayed until
the user interacts with it.

If your notification requires interaction from the user than you can define
the `requireInteraction` option. This will show the notification permanently
until the user dismisses your notification.

<% include('../../demo/web-app/notification-ui/notification-ui.js', 'requireInteraction') %>

The important thing to consider when using this option is if you really have
to use it, showing a notification and forcing the user to stop what they are
doing can be pretty frustrating.

### Actions

Actions allow you to give users another level of interaction with your users.



### Timestamp

## UX Best Practices

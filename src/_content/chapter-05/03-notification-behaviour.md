---
title: Notification Behaviour
---
# Notification Behaviour

Some of the options you pass into *showNotification*  alter the bhaviour
rather than the UI, like how multiple notifications should be treated.

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

### Silent

### Renotify

### Requires Interaction

### Actions

### Timestamp

## UX Best Practices

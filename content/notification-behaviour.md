---
title: Notification Behaviour
weight: 9
---
# Notification Behaviour

So far we've looked at the options that alter the visual appearance of a notification. There are also options that alter the behaviour of notifications.

Be default, calling `showNotification()` with just visual options will have the following behaviours:

- Clicking on the notification does nothing.
- Each new notification is shown one after the other. The browser will not collapse the notifications in any way.
- The platform may play a sound or vibrate the user's devices (depending on the platform).
- On some platforms the notification will disappear after a short
period of time while others will show the notification unless the user interacts with it (For example, compare notifications on Android and Desktop.)

In this section we are going to look at how we can alter these default behaviours using options alone. These are relatively easy to implement and take advantage of.

### Notification Click Event

When a user clicks on a notification the default behaviour is for nothing to happen. It doesn't even close or remove the notification.

The common practice for a notification click is for it to close and perform some other logic (i.e. open a window or make some API call to the application).

To achieve this we need to add a 'notificationclick' event listener to our service worker. This will be called when ever a notification is clicked.

```javascript
{{< inline-file "demos/node-server/frontend/service-worker.js" "simpleNotification" >}}
```

As you can see in this example, the notification that was clicked can be accessed via the `event.notification` parameter. From this we can access the notifications properties and methods. In this case we call its `close()` method and perform additional work.

> Remember: You still need to make use of event.waitUntil() to keep the service worker running while your code is busy.

### Actions

Actions allow you to give users another level of interaction with your users
over just clicking the notification.

In the previous section you saw how to define actions when calling
`showNotification()`:

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "actionsNotification" >}}
```

If the user clicks an action button, check the `event.action` value in the `noticationclick` event to tell which action button was clicked.

`event.action` will contain the `action` value set in the options. In the example above the `event.action` values would be one of the following: 'coffee-action', 'doughnut-action', 'gramophone-action' or 'atom-action'.

With this we would detect notification clicks or action clicks like so:

```javascript
{{< inline-file "static/demos/notification-examples/service-worker.js" "notificationActionClickEvent" >}}
```

![Logs for action button clicks and notification click.](/images/notification-screenshots/action-button-click-logs.png){: .center-image }

### Tag

The *tag* option is a string ID that "groups" notifications together, providing an easy way to determine how multiple notifications are displayed to the user. This is easiest to explain with an example.

Let's display a notification and give it a tag, of
'message-group-1'. We'd display the notification with this code:

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "tagNotificationOne" >}}
```

Which will show our first notification.

![First notification with tag of message group 1.](/images/notification-screenshots/desktop/chrome-first-tag.png){: .center-image }

Let's display a second notification with a new tag of 'message-group-2', like so:

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "tagNotificationTwo" >}}
```

 This will display a second notification to the user.

![Two notifications where the second tag is message group 2.](/images/notification-screenshots/desktop/chrome-second-tag.png){: .center-image }

Now let's show a third notification but re-use the first tag of 'message-group-1'. Doing this will close the first notification and replace it with our new notification.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "tagNotificationThree" >}}
```

Now we have two notifications even though `showNotification()` was called three times.

![Two notifications where the first notification is replaced by a third notification.](/images/notification-screenshots/desktop/chrome-third-tag.png){: .center-image }

The `tag` option is simply a way of grouping messages so that any old notifications that are currently displayed will be closed if they have the same tag as a new notification.

A subtlety to using `tag` is that when it replaces a notification, it will do so *without* a sound and vibration.

This is where the `renotify` option comes in.

### Renotify

This largely applies to mobile devices at the time of writing. Setting this option makes new notifications vibrate and play a system sound.

There are scenarios where you might want a replacing notification to notify the user rather than silently update. Chat applications are a good example. In this case you should set `tag` and `renotify` to true.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "renotifyNotification" >}}
```

**Note:** If you set `renotify: true` on a notification without a tag, you'll get the following error:

    TypeError: Failed to execute 'showNotification' on 'ServiceWorkerRegistration': Notifications which set the renotify flag must specify a non-empty tag

### Silent

This option allows you to show a new notification but prevents the default
behavior of vibration, sound and turning on the device's display.

This is ideal if your notifications don't require immediate attention
from the user.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "silentNotification" >}}
```

**Note:** If you define both *silent* and *renotify*, silent will take precedence.

### Requires Interaction

Chrome on desktop will show notifications for a set time period before hiding them. Chrome on Android doesn't have this behaviour. Notifications are displayed until the user interacts with them.

To force a notification to stay visible until the user interacts with it add the `requireInteraction` option. This will show the notification until the user dismisses or clicks your notification.

```javascript
{{< inline-file "static/demos/notification-examples/notification-examples.js" "requireInteraction" >}}
```

Please use this option with consideration. Showing a notification and forcing the user to stop what they are doing to dismiss your notification can be frustrating.

In the next section we are going to look at some of the common patterns used on the web for managing notifications and performing actions such as opening pages when a notification is clicked.

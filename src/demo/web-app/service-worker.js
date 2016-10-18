self.addEventListener('push', function(event) {
  console.log('Push Event Received.');
  event.waitUntil(Promise.resolve());
});

/**** START notificationClickEvent ****/
self.addEventListener('notificationclick', function(event) {
  if (event.action) {
    console.log('Action Button Click.', event.action);
  } else {
    console.log('Notification Click.');
  }
});
/**** END notificationClickEvent ****/

// This is here just to highlight the simple version of notification click.
// Normally you would only have one notification click listener.
/**** START simpleNotification ****/
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Do something as the result of the notification click
});
/**** END simpleNotification ****/

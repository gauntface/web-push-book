function handlePushEvent(event) {
  return Promise.resolve()
  .then(() => {
    return event.data.json();
  })
  .then((data) => {
    const title = data.notification.title;
    const options = data.notification;
    if (options.tag) {
      options.tag = 'web-push-book-example-site';
    }
    return registration.showNotification(title, options);
  })
  .catch((err) => {
    console.error('Push event caused an error: ', err);

    const title = 'Message Received';
    const options = {
      body: event.data.text(),
      tag: 'web-push-book-example-site'
    };
    return registration.showNotification(title, options);
  });
}

self.addEventListener('push', function(event) {
  event.waitUntil(handlePushEvent(event));
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

/**** START notificationCloseEvent ****/
self.addEventListener('notificationclick', function(event) {
  // TODO: Make analytics API call.
});
/**** END notificationCloseEvent ****/

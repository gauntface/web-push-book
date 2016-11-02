function openWindow(event) {
  /**** START notificationOpenWindow ****/
  event.waitUntil(
    clients.openWindow('/notification-behavior/example-page.html')
  );
  /**** END notificationOpenWindow ****/
}

function focusWindow(event) {
  /**** START notificationFocusWindow ****/
  const urlToOpen = self.location.origin +
    '/notification-behavior/example-page.html';

  /**** START clientsMatchAll ****/
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  /**** END clientsMatchAll ****/
  /**** START searchClients ****/
  .then((windowClients) => {
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient;
        break;
      }
    }

    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow(urlToOpen);
    }
  });
  /**** END searchClients ****/

  event.waitUntil(promiseChain);
  /**** END notificationFocusWindow ****/
}

function dataNotification(event) {
  /**** START printNotificationData ****/
  const notificationData = event.notification.data;
  console.log(notificationData.time);
  console.log(notificationData.message);
  /**** END printNotificationData ****/
}

function demoMustShowNotificationCheck(event) {
  /**** START showNotificationRequired ****/
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    let mustShowNotification = true;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.focused) {
        mustShowNotification = false;
        break;
      }
    }

    return mustShowNotification;
  })
  .then((mustShowNotification) => {
    if (mustShowNotification) {
      return self.registration.showNotification('Had to show a notification.');
    } else {
      console.log('Don\'t need to show a notification.');
    }
  });

  event.waitUntil(promiseChain);
  /**** END showNotificationRequired ****/
}

function demoSendMessageToPage(event) {
  /**** START sendPageMessage ****/
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    let mustShowNotification = true;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.focused) {
        return windowClients;
      }
    }

    return null;
  })
  .then((windowClients) => {
    if (windowClients) {
      windowClients.forEach((windowClient) => {
        windowClient.postMessage({
          message: 'Received a push message.',
          time: new Date().toString()
        });
      });
    } else {
      return self.registration.showNotification('No focused windows', {
        body: 'Had to show a notification instead of messaging each page.'
      });
    }
  });

  event.waitUntil(promiseChain);
  /**** END sendPageMessage ****/
}

self.addEventListener('push', function(event) {
  console.log('Push Event Received.');

  if (event.data) {
    const dataText = event.data.text();
    switch (dataText) {
      case 'must-show-notification':
        demoMustShowNotificationCheck(event);
        return;
      case 'send-message-to-page':
        demoSendMessageToPage(event);
        return;
      default:
        console.warn('Unknown push message: ', dataText);
        break;
    }
  }

  event.waitUntil(Promise.resolve());
});

/**** START notificationClickEvent ****/
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  switch(event.notification.tag) {
    case 'open-window':
      openWindow(event);
      break;
    case 'focus-window':
      focusWindow(event);
      break;
    case 'data-notification':
      dataNotification(event);
      break;
    default:
      // NOOP
      break;
  }
});
/**** END notificationClickEvent ****/

self.addEventListener('message', function(event) {
  switch(event.data) {
    case 'must-show-notification-demo':
      self.dispatchEvent(new PushEvent('push', {
        data: 'must-show-notification'
      }));
      break;
    case 'send-message-to-page-demo':
    self.dispatchEvent(new PushEvent('push', {
      data: 'send-message-to-page'
    }));
      break;
    default:
      console.warn('Unknown message received in service-worker.js');
      break;
  }
});

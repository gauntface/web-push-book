const examplePageURL = '/demos/example-page/';

function openWindow(event) {
  /**** START notificationOpenWindow ****/
  const promiseChain = clients.openWindow(examplePageURL);
  event.waitUntil(promiseChain);
  /**** END notificationOpenWindow ****/
}

function focusWindow(event) {
  /**** START notificationFocusWindow ****/
  /**** START urlToOpen ****/
  const urlToOpen = new URL(examplePageURL, self.location.origin).href;
  /**** END urlToOpen ****/

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
  console.log('');
  console.log('The data notification had the following parameters:');
  Object.keys(notificationData).forEach((key) => {
    console.log(`  ${key}: ${notificationData[key]}`);
  });
  console.log('');
  /**** END printNotificationData ****/
}

/**** START isClientFocused ****/
function isClientFocused() {
  return clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    let clientIsFocused = false;
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.focused) {
        clientIsFocused = true;
        break;
      }
    }

    return clientIsFocused;
  });
}
/**** END isClientFocused ****/

// TODO (mattgaunt): This was originally passing in event
// and using event.WaitUntil(), that now causes an error - investigate
async function demoMustShowNotificationCheck() {
  /**** START showNotificationRequired ****/
  if (await isClientFocused()) {
    console.log('Don\'t need to show a notification.');
    return;
  }

  // Client isn't focused, we need to show a notification.
  return self.registration.showNotification('Had to show a notification.');
  /**** END showNotificationRequired ****/
}

// TODO (mattgaunt): This was originally passing in event
// and using event.WaitUntil(), that now causes an error - investigate
async function demoSendMessageToPage() {
  /**** START sendPageMessage ****/
  if (await isClientFocused()) {
    const windowClients = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });
    windowClients.forEach((windowClient) => {
      windowClient.postMessage({
        message: 'Received a push message.',
        time: new Date().toString()
      });
    });
    return;
  }

  return self.registration.showNotification('No focused windows', {
    body: 'Had to show a notification instead of messaging each page.'
  });
  /**** END sendPageMessage ****/
}

self.addEventListener('push', function(event) {
  if (event.data) {
    switch(event.data.text()) {
      case 'must-show-notification':
        demoMustShowNotificationCheck(event);
        break;
      case 'send-message-to-page':
        demoSendMessageToPage(event);
        break;
      default:
        console.warn('Unsure of how to handle push event: ', event.data);
        break;
    }
  }
});

/**** START notificationActionClickEvent ****/
self.addEventListener('notificationclick', function(event) {
  if (!event.action) {
    // Was a normal notification click
    console.log('Notification Click.');
    return;
  }

  switch (event.action) {
    case 'coffee-action':
      console.log('User ❤️️\'s coffee.');
      break;
    case 'doughnut-action':
      console.log('User ❤️️\'s doughnuts.');
      break;
    case 'gramophone-action':
      console.log('User ❤️️\'s music.');
      break;
    case 'atom-action':
      console.log('User ❤️️\'s science.');
      break;
    default:
      console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});
/**** END notificationActionClickEvent ****/

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

const notificationCloseAnalytics = () => {
  return Promise.resolve();
};

/**** START notificationCloseEvent ****/
self.addEventListener('notificationclose', function(event) {
  const dismissedNotification = event.notification;

  const promiseChain = notificationCloseAnalytics();
  event.waitUntil(promiseChain);
});
/**** END notificationCloseEvent ****/

self.addEventListener('message', function(event) {
  console.log('Received message from page.', event.data);
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

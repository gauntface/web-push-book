const NOTIFICATION_DELAY = 2500;
let messageIndex = 0;
const fakeMessages = [
  'Heyo',
  'Hows it goin?',
  'What you been up to?',
  'These aren\'t real messages.',
];
const userIcon = '/images/matt-512x512.png';
const userName = 'Matt';

function registerServiceWorker() {
  return navigator.serviceWorker.register('/notification-behavior/service-worker.js')
  .then(function(registration) {
    console.log('Service worker successfully registered.');
    return registration;
  })
  .catch(function(err) {
    console.error('Unable to register service worker.', err);
  });
}

function openWindow(registration) {
  const options = {
    body: 'Clicking on this notification will open a new tab / window.',
    tag: 'open-window'
  };
  registration.showNotification('Open a Window', options);
}

function focusWindow(registration) {
  const options = {
    body: 'Clicking on this notification will focus on an open window ' +
      'otherwise open a new one.',
    tag: 'focus-window'
  };
  registration.showNotification('Focus or Open a Window', options);
}

function cachePage(registration) {
  console.log('TODO cache page');
}

function dataNotification(registration) {
  /**** START addNotificationData ****/
  const options = {
    body: 'This notification has data attached to it that is printed ' +
      'to the console when it\'s clicked.',
    tag: 'data-notification',
    data: {
      time: new Date(Date.now()).toString(),
      message: 'Hello, World!'
    }
  };
  registration.showNotification('Notification with Data', options);
  /**** END addNotificationData ****/
}

function mergeNotification(registration) {
  const userMessage = fakeMessages[messageIndex];
  /**** START getNotifications ****/
  return registration.getNotifications()
  .then(notifications => {
    let currentNotification;

    for(let i = 0; i < notifications.length; i++) {
      if (notifications[i].data &&
        notifications[i].data.userName === userName) {
        currentNotification = notifications[i];
      }
    }

    return currentNotification;
  })
  /**** END getNotifications ****/
  /**** START manipulateNotification ****/
  .then((currentNotification) => {
    let notificationTitle;
    const options = {
      icon: userIcon,
    }

    if (currentNotification) {
      // We have an open notification, let's so something with it.
      const messageCount = currentNotification.data.newMessageCount + 1;

      options.body = `You have ${messageCount} new messages from ${userName}.`;
      options.data = {
        userName: userName,
        newMessageCount: messageCount
      };
      notificationTitle = `New Messages from ${userName}`;

      currentNotification.close();
    } else {
      options.body = `"${userMessage}"`;
      options.data = {
        userName: userName,
        newMessageCount: 1
      };
      notificationTitle = `New Message from ${userName}`;
    }

    return registration.showNotification(
      notificationTitle,
      options
    );
  });
  /**** END manipulateNotification ****/
}

function mustShowNotification(registration) {
  setTimeout(() => {
    const serviceWorker = registration.install || registration.waiting ||
      registration.active;
    serviceWorker.postMessage('must-show-notification-demo');
  }, 4000);
}

function sendMessageToPage(registration) {
  setTimeout(() => {
    const serviceWorker = registration.install || registration.waiting ||
      registration.active;
    serviceWorker.postMessage('send-message-to-page-demo');
  }, 4000);
}

function setUpSWMessageListener() {
  /**** START swMessageListener ****/
  navigator.serviceWorker.addEventListener('message', function(event) {
    console.log('Received a message from service worker: ', event.data);
  });
  /**** END swMessageListener ****/
}

const setUpNotificationButtons = function() {
  setUpSWMessageListener();
  const configs = [
    {
      className: 'js-open-window',
      cb: openWindow
    },
    {
      className: 'js-focus-window',
      cb: focusWindow
    },
    {
      className: 'js-cache-page',
      cb: cachePage
    },
    {
      className: 'js-data-notification',
      cb: dataNotification
    },
    {
      className: 'js-merge-notification',
      cb: (reg) => {
        mergeNotification(reg)
        .then(() => {
          messageIndex++;

          if (messageIndex >= fakeMessages.length) {
            messageIndex = 0;
          }
        })
      }
    },
    {
      className: 'js-must-show-notification',
      cb: mustShowNotification
    },
    {
      className: 'js-send-message-to-page',
      cb: sendMessageToPage
    }
  ];

  return registerServiceWorker()
  .then(function(registration) {
    configs.forEach(function(config) {
      const button = document.querySelector(`.${config.className}`);
      if (!button) {
        console.error('No button found with classname: ', config.className);
        return;
      }
      button.addEventListener('click', function() {
        config.cb(registration);
      });
    });
  });
};

const displayNoPermissionError = function() {

};

window.onload = function() {
  if (!('serviceWorker' in navigator)) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    return;
  }

  if (!('PushManager' in window)) {
    // Push isn't supported on this browser, disable or hide UI.
    return;
  }

  if (Notification.permission !== 'granted') {
    const promiseChain = Notification.requestPermission(function(result) {
      if (result === 'granted') {
        setUpNotificationButtons();
      } else {
        displayNoPermissionError();
      }
    });
    if (promiseChain) {
        promiseChain.then(function(result) {
          if (result === 'granted') {
            setUpNotificationButtons();
          } else {
            displayNoPermissionError();
          }
        });
    }
  } else {
    setUpNotificationButtons();
  }
};

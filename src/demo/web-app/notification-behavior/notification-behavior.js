const NOTIFICATION_DELAY = 2500;

function registerServiceWorker() {
  return navigator.serviceWorker.register('/service-worker.js')
  .then(function(registration) {
    console.log('Service worker successfully registered.');
    return registration;
  })
  .catch(function(err) {
    console.error('Unable to register service worker.', err);
  });
}

function openWindow(registration) {
  console.log('TODO Open Window');
}

function focusWindow(registration) {
  console.log('TODO focus Window');
}

function cachePage(registration) {
  console.log('TODO cache page');
}

function mergeNotification(registration) {
  console.log('TODO merge notification');
}

const setUpNotificationButtons = function() {
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
      className: 'js-merge-notification',
      cb: mergeNotification
    },
    {
      className: 'js-notification-image',
      cb: imageNotification
    },
    {
      className: 'js-notification-vibrate',
      cb: vibrateNotification
    },
    {
      className: 'js-notification-sound',
      cb: soundNotification
    },
    {
      className: 'js-notification-dir-ltr',
      cb: dirLTRNotification
    },
    {
      className: 'js-notification-actions',
      cb: actionsNotification
    },
    {
      className: 'js-notification-dir-rtl',
      cb: dirRTLNotification
    },
    {
      className: 'js-notification-timestamp',
      cb: timestampNotification
    },
    {
      className: 'js-notification-overview',
      cb: overviewNotification
    },
    {
      className: 'js-notification-tag',
      cb: notificationTag
    },
    {
      className: 'js-notification-renotify',
      cb: renotifyNotification
    },
    {
      className: 'js-notification-default',
      cb: defaultNotification
    },
    {
      className: 'js-notification-silent',
      cb: silentNotification
    },
    {
      className: 'js-notification-require-interaction',
      cb: requiresInteractionNotification
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

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

const overviewNotification = function(registration) {
  const title = 'Web Push Book';
  const options = {
    body: 'This would be the body text of the notification.\n' +
      'It can hold two lines of text.',
    icon: '/notification-ui/icon-512x512.png',
    badge: '/notification-ui/badge-128x128.png',
    image: '/notification-ui/Unsplash-Farzad Nazifi-1600x1100.jpg',
    actions: [
      {
        action: 'download-book-action',
        title: 'Download Book',
        icon: '/notification-ui/action-download-book-128x128.png'
      }
    ]
  };
  registration.showNotification(title, options);
};

const titleAndBodyNotification = function(registration) {
  /**** START titleAndBodySimple ****/
  const title = 'Simple Title';
  const options = {
    body: 'Simple piece of body text.\nSecond line of body text :)'
  };
  registration.showNotification(title, options);
  /**** END titleAndBodySimple ****/
};

const longTitleAndBodyNotification = function(registration) {
  /**** START longTitleAndBodySimple ****/
  const title = 'Ice cream dragée croissant gingerbread topping carrot cake ' +
    'cookie biscuit macaroon. Chocolate bonbon sweet roll pastry. ' +
    'Croissant cake jelly-o halvah. Tootsie roll muffin croissant bear claw.';
  const options = {
    body: 'Lollipop cheesecake sesame snaps marshmallow chocolate bar. ' +
      'Pie fruitcake soufflé toffee lemon drops bonbon candy. ' +
      'Pie cupcake icing candy marzipan chocolate. ' +
      'Soufflé candy canes wafer. Tiramisu sweet roll brownie gummies ' +
      'sweet roll icing donut cake. Gummies croissant caramels pastry ' +
      'gingerbread dessert brownie gingerbread. Tiramisu carrot cake ' +
      'jujubes pie brownie sesame snaps.'
  };
  registration.showNotification(title, options);
  /**** END longTitleAndBodySimple ****/
};

const iconNotification = function(registration) {
  /**** START iconNotification ****/
  const title = 'Icon Notification';
  const options = {
    icon: '/notification-ui/icon-512x512.png'
  };
  registration.showNotification(title, options);
  /**** END iconNotification ****/
};

const badgeNotification = function(registration) {
  /**** START badgeNotification ****/
  const title = 'Badge Notification';
  const options = {
    badge: '/notification-ui/badge-128x128.png'
  };
  registration.showNotification(title, options);
  /**** END badgeNotification ****/
};

const imageNotification = function(registration) {
  /**** START imageNotification ****/
  const title = 'Image Notification';
  const options = {
    image: '/notification-ui/Unsplash-Farzad Nazifi-1600x1100.jpg'
  };
  registration.showNotification(title, options);
  /**** END imageNotification ****/
};

const vibrateNotification = function(registration) {
  /**** START vibrateNotification ****/
  const title = 'Vibrate Notification';
  const options = {
    // Star Wars shamelessly taken from the awesome Peter Beverloo
    // https://tests.peter.sh/notification-generator/
    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
  };
  registration.showNotification(title, options);
  /**** END vibrateNotification ****/
};

const soundNotification = function(registration) {
  /**** START soundNotification ****/
  const title = 'Sound Notification';
  const options = {
    sound: '/notification-ui/notification-sound.mp3'
  };
  registration.showNotification(title, options);
  /**** END soundNotification ****/
};

const dirLTRNotification = function(registration) {
  /**** START dirLTRNotification ****/
  const title = 'Direction LTR Notification';
  const options = {
    body: 'Simple piece of body text.\nSecond line of body text :)',
    dir: 'ltr',
    actions: [{
      title: 'Action 1',
      action: 'action-1'
    }, {
      title: 'Action 2',
      action: 'action-1'
    }]
  };
  registration.showNotification(title, options);
  /**** END dirLTRNotification ****/
};

const dirRTLNotification = function(registration) {
  /**** START dirRTLNotification ****/
  const title = 'المغلوطة حول استنكار  النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤ.';
  const options = {
    body: 'المغلوطة حول استنكار  النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤ.',
    dir: 'rtl',
    actions: [{
      title: 'الصف 1 العمود 1',
      action: 'action-1'
    }, {
      title: 'الصف 1 العمود 2',
      action: 'action-2'
    }]
  };
  registration.showNotification(title, options);
  /**** END dirRTLNotification ****/
};

const actionsNotification = function(registration) {
  /**** START actionsNotification ****/
  const title = 'Actions Notification';
  const options = {
    actions: [
      {
        action: 'example-action-1',
        title: 'Coffee',
        icon: '/notification-ui/action-1-128x128.png'
      },
      {
        action: 'example-action-2',
        title: 'Doughnut',
        icon: '/notification-ui/Donut_24px.png'
        // icon: '/notification-ui/action-2-128x128.png'
      },
      {
        action: 'example-action-3',
        title: 'gramophone',
        icon: '/notification-ui/action-3-128x128.png'
      },
      {
        action: 'example-action-4',
        title: 'Atom',
        icon: '/notification-ui/action-4-128x128.png'
      }
    ]
  };
  registration.showNotification(title, options);
  /**** END actionsNotification ****/
};

const defaultNotification = function(registration) {
  const title = 'Default Notification';
  const options = {
    body: 'This notification has no behavioural options set.'
  };
  registration.showNotification(title, options);
}

const notificationTag = function(registration) {
  setTimeout(() => {
    /**** START tagNotificationOne ****/
    const title = 'First Notification';
    const options = {
      body: 'With \'tag\' of \'message-group-1\'',
      tag: 'message-group-1'
    };
    registration.showNotification(title, options);
    /**** END tagNotificationOne ****/
  }, NOTIFICATION_DELAY);

  setTimeout(() => {
    /**** START tagNotificationTwo ****/
    const title = 'Second Notification';
    const options = {
      body: 'With \'tag\' of \'message-group-2\'',
      tag: 'message-group-2'
    };
    registration.showNotification(title, options);
    /**** END tagNotificationTwo ****/
  }, NOTIFICATION_DELAY * 2);

  setTimeout(() => {
    /**** START tagNotificationThree ****/
    const title = 'Third Notification';
    const options = {
      body: 'With \'tag\' of \'message-group-1\'',
      tag: 'message-group-1'
    };
    registration.showNotification(title, options);
    /**** END tagNotificationThree ****/
  }, NOTIFICATION_DELAY * 3);
};

const renotifyNotification = function(registration) {
  setTimeout(() => {
    const title = 'First Notification';
    const options = {
      body: 'With "tag: \'renotify\'".',
      tag: 'renotify'
    };
    registration.showNotification(title, options);
  }, NOTIFICATION_DELAY);

  setTimeout(() => {
    /**** START renotifyNotification ****/
    const title = 'Second Notification';
    const options = {
      body: 'With "renotify: true" and "tag: \'renotify\'".',
      tag: 'renotify',
      renotify: true
    };
    registration.showNotification(title, options);
    /**** END renotifyNotification ****/
  }, NOTIFICATION_DELAY * 2);
};

const silentNotification = function(registration) {
  /**** START silentNotification ****/
  const title = 'Silent Notification';
  const options = {
    body: 'With "silent: \'true\'".',
    silent: true
  };
  registration.showNotification(title, options);
  /**** END silentNotification ****/
};

const requiresInteractionNotification = function(registration) {
  /**** START requireInteraction ****/
  const title = 'Require Interaction Notification';
  const options = {
    body: 'With "requireInteraction: \'true\'".',
    requireInteraction: true
  };
  registration.showNotification(title, options);
  /**** END requireInteraction ****/
};

const setUpNotificationButtons = function() {
  const configs = [
    {
      className: 'js-notification-title-body',
      cb: titleAndBodyNotification
    },
    {
      className: 'js-notification-long-title-body',
      cb: longTitleAndBodyNotification
    },
    {
      className: 'js-notification-icon',
      cb: iconNotification
    },
    {
      className: 'js-notification-badge',
      cb: badgeNotification
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

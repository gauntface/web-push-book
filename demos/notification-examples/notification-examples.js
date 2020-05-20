(function() {
  const NOTIFICATION_DELAY = 2500;

  let messageIndex = 0;
  const fakeMessages = [
    'Heyo',
    'Hows it goin?',
    'What you been up to?',
    'These aren\'t real messages.',
  ];
  const userIcon = '/images/demos/matt-512x512.png';
  const userName = 'Matt';

  const promiseTimeout = function(cb, timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        cb();
        resolve();
      }, timeout);
    });
  };

  function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      console.log('Service worker successfully registered.');
      return registration;
    })
    .catch(function(err) {
      console.error('Unable to register service worker.', err);
    });
  }

  const allOptionsNotification = function(registration) {
    const title = 'Web Push Book';
    const options = {
      body: 'This would be the body text of the notification.\n' +
        'It can hold two lines of text.',
      icon: '/images/demos/icon-512x512.png',
      badge: '/images/demos/badge-128x128.png',
      image: '/images/demos/unsplash-farzad-nazifi-1600x1100.jpg',
      tag: 'example-notification',
      actions: [
        {
          action: 'download-book-action',
          title: 'Download Book',
          icon: '/images/demos/action-download-book-128x128.png'
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
      icon: '/images/demos/icon-512x512.png'
    };
    registration.showNotification(title, options);
    /**** END iconNotification ****/
  };

  const badgeNotification = function(registration) {
    /**** START badgeNotification ****/
    const title = 'Badge Notification';
    const options = {
      badge: '/images/demos/badge-128x128.png'
    };
    registration.showNotification(title, options);
    /**** END badgeNotification ****/
  };

  const imageNotification = function(registration) {
    /**** START imageNotification ****/
    const title = 'Image Notification';
    const options = {
      image: '/images/demos/unsplash-farzad-nazifi-1600x1100.jpg'
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
      sound: '/demos/notification-examples/audio/notification-sound.mp3'
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

  const timestampNotification = function(registration) {
    /**** START timestampNotification ****/
    const title = 'Timestamp Notification';
    const options = {
      body: 'Timestamp is set to "01 Jan 2000 00:00:00".',
      timestamp: Date.parse('01 Jan 2000 00:00:00')
    };
    registration.showNotification(title, options);
    /**** END timestampNotification ****/
  };

  const actionsNotification = function(registration) {
    /**** START actionsNotification ****/
    const title = 'Actions Notification';
    const options = {
      actions: [
        {
          action: 'coffee-action',
          title: 'Coffee',
          icon: '/images/demos/action-1-128x128.png'
        },
        {
          action: 'doughnut-action',
          title: 'Doughnut',
          icon: '/images/demos/action-2-128x128.png'
        },
        {
          action: 'gramophone-action',
          title: 'gramophone',
          icon: '/images/demos/action-3-128x128.png'
        },
        {
          action: 'atom-action',
          title: 'Atom',
          icon: '/images/demos/action-4-128x128.png'
        }
      ]
    };

    const maxVisibleActions = Notification.maxActions;
    if (maxVisibleActions < 4) {
      options.body = `This notification will only display ` +
        `${maxVisibleActions} actions.`;
    } else {
      options.body = `This notification can display up to ` +
        `${maxVisibleActions} actions.`;
    }

    registration.showNotification(title, options);
    /**** END actionsNotification ****/
  };

  const notificationTag = function(registration) {
    /**** START tagNotificationOne ****/
    const title = 'Notification 1 of 3';
    const options = {
      body: 'With \'tag\' of \'message-group-1\'',
      tag: 'message-group-1'
    };
    registration.showNotification(title, options);
    /**** END tagNotificationOne ****/

    return Promise.resolve()
    .then(() => {
      return promiseTimeout(() => {
        /**** START tagNotificationTwo ****/
        const title = 'Notification 2 of 3';
        const options = {
          body: 'With \'tag\' of \'message-group-2\'',
          tag: 'message-group-2'
        };
        registration.showNotification(title, options);
        /**** END tagNotificationTwo ****/
      }, NOTIFICATION_DELAY);
    })
    .then(() => {
      return promiseTimeout(() => {
        /**** START tagNotificationThree ****/
        const title = 'Notification 3 of 3';
        const options = {
          body: 'With \'tag\' of \'message-group-1\'',
          tag: 'message-group-1'
        };
        registration.showNotification(title, options);
        /**** END tagNotificationThree ****/
      }, NOTIFICATION_DELAY);
    });
  };

  const renotifyNotification = function(registration) {
    const title = 'Notification 1 of 2';
    const options = {
      tag: 'renotify'
    };
    registration.showNotification(title, options);

    return Promise.resolve()
    .then(() => {
      promiseTimeout(() => {
        /**** START renotifyNotification ****/
        const title = 'Notification 2 of 2';
        const options = {
          tag: 'renotify',
          renotify: true
        };
        registration.showNotification(title, options);
        /**** END renotifyNotification ****/
      }, NOTIFICATION_DELAY)
    });
  };

  const silentNotification = function(registration) {
    /**** START silentNotification ****/
    const title = 'Silent Notification';
    const options = {
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

  const openWindow = function(registration) {
    const options = {
      body: 'Clicking on this notification will open a new tab / window.',
      tag: 'open-window'
    };
    registration.showNotification('Open a Window', options);
  };

  const focusWindow = function(registration) {
    const options = {
      body: 'Clicking on this notification will focus on an open window ' +
        'otherwise open a new one.',
      tag: 'focus-window'
    };
    registration.showNotification('Focus or Open a Window', options);
  };

  const dataNotification = function(registration) {
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
  };

  const mergeNotification = function(registration) {
    const userMessage = fakeMessages[messageIndex];
    /**** START getNotifications ****/
    const promiseChain = registration.getNotifications()
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
        // We have an open notification, let's do something with it.
        const messageCount = currentNotification.data.newMessageCount + 1;

        options.body = `You have ${messageCount} new messages from ${userName}.`;
        options.data = {
          userName: userName,
          newMessageCount: messageCount
        };
        notificationTitle = `New Messages from ${userName}`;

        // Remember to close the old notification.
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

    return promiseChain;
  };

  const mustShowNotification = function(registration) {
    return promiseTimeout(() => {
      const serviceWorker = registration.install || registration.waiting ||
        registration.active;
      serviceWorker.postMessage('must-show-notification-demo');
    }, 4000);
  };

  const sendMessageToPage = function(registration) {
    return promiseTimeout(() => {
      const serviceWorker = registration.install || registration.waiting ||
        registration.active;
      serviceWorker.postMessage('send-message-to-page-demo');
    }, 4000);
  };

  const setUpSWMessageListener = function() {
    /**** START swMessageListener ****/
    navigator.serviceWorker.addEventListener('message', function(event) {
      console.log('Received a message from service worker: ', event.data);
    });
    /**** END swMessageListener ****/
  };

  const setUpNotificationButtons = function() {
    setUpSWMessageListener();

    const configs = [
      {
        className: 'js-notification-title-body',
        cb: titleAndBodyNotification,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-long-title-body',
        cb: longTitleAndBodyNotification,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-icon',
        cb: iconNotification,
        enabled: () => {
          return ('icon' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-badge',
        cb: badgeNotification,
        enabled: () => {
          return ('badge' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-image',
        cb: imageNotification,
        enabled: () => {
          return ('image' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-vibrate',
        cb: vibrateNotification,
        enabled: () => {
          return ('vibrate' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-sound',
        cb: soundNotification,
        enabled: () => {
          return ('sound' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-dir-ltr',
        cb: dirLTRNotification,
        enabled: () => {
          return ('dir' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-actions',
        cb: actionsNotification,
        enabled: () => {
          return ('actions' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-dir-rtl',
        cb: dirRTLNotification,
        enabled: () => {
          return ('dir' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-timestamp',
        cb: timestampNotification,
        enabled: () => {
          return ('timestamp' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-overview',
        cb: allOptionsNotification,
        enabled: () => {
          return true;
        },
      },
      {
        className: 'js-notification-tag',
        cb: notificationTag,
        enabled: () => {
          return ('tag' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-renotify',
        cb: renotifyNotification,
        enabled: () => {
          return ('renotify' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-silent',
        cb: silentNotification,
        enabled: () => {
          return ('silent' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-require-interaction',
        cb: requiresInteractionNotification,
        enabled: () => {
          return ('requireInteraction' in Notification.prototype);
        }
      },
      {
        className: 'js-open-window',
        cb: openWindow,
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-focus-window',
        cb: focusWindow,
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-data-notification',
        cb: dataNotification,
        enabled: () => {
          return true;
        }
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
        },
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-must-show-notification',
        cb: mustShowNotification,
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-send-message-to-page',
        cb: sendMessageToPage,
        enabled: () => {
          return true;
        }
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
          const promiseResult = config.cb(registration);
          if (promiseResult) {
            button.disabled = true;
            promiseResult.then(() => {
              button.disabled = false;
            })
          }
        });
        button.disabled = !config.enabled();
      });
    });
  };

  window.addEventListener('load', function() {
    if (!('serviceWorker' in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      return;
    }

    if (!('PushManager' in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      return;
    }

    let promiseChain = new Promise((resolve, reject) => {
      const permissionPromise = Notification.requestPermission((result) => {
        resolve(result);
      });
      if (permissionPromise) {
        permissionPromise.then(resolve);
      }
    })
    .then((result) => {
      if (result === 'granted') {
        setUpNotificationButtons();
      } else {
        displayNoPermissionError();
      }
    });
  });
})();

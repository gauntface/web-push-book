const pushCheckbox = document.querySelector('.js-push-toggle-checkbox');

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**** START register-sw ****/
function registerServiceWorker() {
  return navigator.serviceWorker.register('service-worker.js')
  .then(registration => {
    console.log('Service worker successfully registered.');
    return registration;
  })
  .catch(err => {
    console.error('Unable to register service worker.', err);
  });
}
/**** END register-sw ****/

// This is just to make sample code eaier to read.
// TODO: Move into a variable rather than register each time.
function getSWRegistration() {
  return navigator.serviceWorker.register('service-worker.js');
}

/**** START request-permission ****/
function askPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(result => {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(permissionResult => {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    }
  });
}
/**** END request-permission ****/

function unsubscribeUserFromPush() {
  return registerServiceWorker()
    .then(registration =>
      // Service worker is active so now we can subscribe the user.
      registration.pushManager.getSubscription()
    )
    .then(subscription => {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .then(subscription => {
      pushCheckbox.disabled = false;
      pushCheckbox.checked = false;
    })
    .catch(err => {
      console.error('Failed to subscribe the user.', err);
      pushCheckbox.disabled = Notification.permission === 'denied';
      pushCheckbox.checked = false;
    });
}

/**** START send-subscription-to-server ****/
function sendSubscriptionToBackEnd(subscription) {
  return fetch('/api/save-subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Bad status code from server.');
    }

    return response.json();
  })
  .then(responseData => {
    if (!(responseData.data && responseData.data.success)) {
      throw new Error('Bad response from server.');
    }
  });
}
/**** END send-subscription-to-server ****/

/**** START subscribe-user ****/
function subscribeUserToPush() {
  return getSWRegistration()
  .then(registration => {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      )
    };

    return registration.pushManager.subscribe(subscribeOptions);
  })
  .then(pushSubscription => {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return pushSubscription;
  });
}
/**** END subscribe-user ****/

function setUpPush() {
  return registerServiceWorker()
  .then(registration => {
    if (Notification.permission === 'denied') {
      console.warn('The notification permission has been blocked. Nothing we can do.');
      return;
    }

    pushCheckbox.addEventListener('change', event => {
      // Disable UI until we've handled what to do.
      event.target.disabled = true;

      if (event.target.checked) {
        // Just been checked meaning we need to subscribe the user
        // Do we need to wait for permission?
        let promiseChain = Promise.resolve();
        if (Notification.permission !== 'granted') {
          promiseChain = askPermission();
        }

        promiseChain
          .then(subscribeUserToPush)
          .then(subscription => {
            if (subscription) {
              return sendSubscriptionToBackEnd(subscription)
              .then(() => subscription);
            }

            return subscription;
          })
          .then(subscription => {
            // We got a subscription AND it was sent to our backend,
            // re-enable our UI and set up state.
            pushCheckbox.disabled = false;
            pushCheckbox.checked = subscription !== null;
          })
          .catch(err => {
            console.error('Failed to subscribe the user.', err);

            // An error occured while requestion permission, getting a
            // subscription or sending it to our backend. Re-set state.
            pushCheckbox.disabled = Notification.permission === 'denied';
            pushCheckbox.checked = false;
          });
      } else {
        // Just been unchecked meaning we need to unsubscribe the user
        unsubscribeUserFromPush();
      }
    });

    if (Notification.permission !== 'granted') {
      // If permission isn't granted than we can't be subscribed for Push.
      pushCheckbox.disabled = false;
      return;
    }

    return registration.pushManager.getSubscription()
    .then(subscription => {
      pushCheckbox.checked = subscription !== null;
      pushCheckbox.disabled = false;
    });
  })
  .catch(err => {
    console.log(`Unable to register the service worker: ${err}`);
  });
}

window.onload = () => {
  /**** START feature-detect ****/
  if (!('serviceWorker' in navigator)) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    return;
  }

  if (!('PushManager' in window)) {
    // Push isn't supported on this browser, disable or hide UI.
    return;
  }
  /**** END feature-detect ****/

  // Push is supported.
  setUpPush();
};

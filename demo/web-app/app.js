const pushCheckbox = document.querySelector('.js-push-toggle-checkbox');
const publicVapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

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

function waitForServiceWorkerToBeActive(registration) {
  const serviceWorker = registration.installing || registration.waiting ||
    registration.active;
  
  return new Promise(function(resolve, reject) {
    if (serviceWorker.state === 'activated') {
      resolve(registration);
      return;
    }

    let stateChangeListener = function() {
      if (serviceWorker.state === 'activated') {
        resolve(registration);
      } else if (serviceWorker.state === 'redundant') {
        reject(new Error('Registration has a redundant service worker.'));
      } else {
        return;
      }
      serviceWorker.removeEventListener('statechange', stateChangeListener);
    };
    serviceWorker.addEventListener('statechange', stateChangeListener);
  });
}

function registerServiceWorker() {
  return navigator.serviceWorker.register('service-worker.js')
  .catch(err => {
    console.error('Unable to register service worker', err);
  });
}

function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      if (result === 'granted') {
        resolve();
      } else {
        reject();
      }
    });
    if (permissionResult) {
      permissionResult
      .then(function(result) {
        if (result === 'granted') {
          resolve();
        } else {
          reject();
        }
      }, reject);
    }
  });
}

function unsubscribeUserFromPush() {
  return registerServiceWorker()
    .then(function(registration) {
      return waitForServiceWorkerToBeActive(registration);
    })
    .then(function(registration) {
      // Service worker is active so now we can subscribe the user.
      return registration.pushManager.getSubscription();
    })
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .then(function(subscription) {
      pushCheckbox.disabled = false;
      pushCheckbox.checked = false;
    })
    .catch(function(err) {
      console.error('Failed to subscribe the user.', err);
      pushCheckbox.disabled = Notification.permission === 'denied';
      pushCheckbox.checked = false;
    });
}

function subscribeUserToPush() {
  return registerServiceWorker()
    .then(function(registration) {
      return waitForServiceWorkerToBeActive(registration);
    })
    .then(function(registration) {
      // Do we need to wait for permission?
      if (Notification.permission !== 'granted') {
        return askPermission()
        .then(function() {
          return registration;
        });
      }

      return registration;
    })
    .then(function(registration) {
      // Service worker is active so now we can subscribe the user.
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
    })
    .then(function(subscription) {
      if (subscription) {
        // TODO: Send subscription to server
        return fetch('/api/save-subscription/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(subscription)
        })
        .then(function() {
          return subscription;
        })
      }
      return subscription;
    })
    .then(function(subscription) {
      pushCheckbox.disabled = false;
      pushCheckbox.checked = subscription !== null;
    })
    .catch(function(err) {
      console.error('Failed to subscribe the user.', err);
      pushCheckbox.disabled = Notification.permission === 'denied';
      pushCheckbox.checked = false;
    });
}

function setUpPush() {
  return registerServiceWorker()
  .then(function(registration) {
    if (Notification.permission === 'denied') {
      console.warn('The notification permission has been blocked. Nothing we can do.');
      return;
    }

    pushCheckbox.addEventListener('change', function(event) {
      // Disable UI until we've handled what to do.
      event.target.disabled = true;

      if (event.target.checked) {
        // Just been checked meaning we need to subscribe the user
        subscribeUserToPush();
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
    .then(function(subscription) {
      pushCheckbox.checked = subscription !== null;
      pushCheckbox.disabled = false;
    });
  })
  .catch(function(err) {
    console.log('Unable to register the service worker: ' + err);
  });
}

window.onload = function() {
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

function registerServiceWorker() {
  return navigator.serviceWorker.register('/service-worker.js')
  .then(registration => {
    console.log('Successfully registered the service worker.');
    return registration;
  })
  .catch(err => {
    console.error('Unable to register service worker', err);
  });
}

function handlePush() {
  return registerServiceWorker()
  .then(function(registration) {

  });
}

window.onload = function() {
  if (!('serviceWorker' in navigator) || ) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    return;
  }

  if (!('PushManager' in window)) {
    // Push isn't supported on this browser, disable or hide UI.
    return;
  }

  // Push is supported.
  handlePush();
};

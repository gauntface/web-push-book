navigator.serviceWorker.register('/path/to/serviceworker.js')
.then(registration => {
  console.log('Successfully registered the service worker.');
})
.catch(err => {
  console.error('Unable to register service worker', err);
});

self.addEventListener('push', function(event) {
  const promiseChain = self.registration.showNotification('Hello, World.');
  
  event.waitUntil(promiseChain);
});

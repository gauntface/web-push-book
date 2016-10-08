self.addEventListener('push', function(event) {
  console.log('Push Event Received.');
  event.waitUntil(Promise.resolve());
});

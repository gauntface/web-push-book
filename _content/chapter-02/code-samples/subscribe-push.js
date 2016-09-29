function subscribeUserForPush(registration) {
  return registration.pushManager.subscribe({
    userVisibleOnly: true
  })
  ,then(subscription => {
      console.log('User subscribe for push messaging', subscription);
  })
  .catch(err => {
      console.error('Unable to subscribe user for push', err);
  });
}

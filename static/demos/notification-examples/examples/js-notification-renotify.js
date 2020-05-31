async function onRenotifyClick() {
  const reg = await getSW();

  let title = 'Notification 1 of 2';
  let options = {
    tag: 'renotify'
  };
  reg.showNotification(title, options);

  await sleep(NOTIFICATION_DELAY);

  /**** START renotifyNotification ****/
  title = 'Notification 2 of 2';
  options = {
    tag: 'renotify',
    renotify: true
  };
  reg.showNotification(title, options);
  /**** END renotifyNotification ****/
}

function isRenotifySupported() {
  return ('renotify' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isRenotifySupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-renotify');
  btn.disabled = false;
  btn.addEventListener('click', onRenotifyClick);
})
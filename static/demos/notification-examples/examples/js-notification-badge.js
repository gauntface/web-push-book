async function onBadgeClick() {
  const reg = await getSW();
  /**** START badgeNotification ****/
  const title = 'Badge Notification';
  const options = {
    badge: '/demos/notification-examples/images/badge-128x128.png'
  };
  reg.showNotification(title, options);
  /**** END badgeNotification ****/
}

function isBadgeSupported() {
  return ('badge' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isBadgeSupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-badge');
  btn.disabled = false;
  btn.addEventListener('click', onBadgeClick);
})
async function onIconClick() {
  const reg = await getSW();
  /**** START iconNotification ****/
  const title = 'Icon Notification';
  const options = {
    icon: '/demos/notification-examples/images/icon-512x512.png'
  };
  reg.showNotification(title, options);
  /**** END iconNotification ****/
}

function isIconSupported() {
  return ('icon' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isIconSupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-icon');
  btn.disabled = false;
  btn.addEventListener('click', onIconClick);
})
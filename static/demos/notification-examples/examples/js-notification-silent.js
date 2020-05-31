async function onSilentClick() {
  const reg = await getSW();
  /**** START silentNotification ****/
  const title = 'Silent Notification';
  const options = {
    silent: true
  };
  reg.showNotification(title, options);
  /**** END silentNotification ****/
}

function isSilentSupported() {
  return ('silent' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isSilentSupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-silent');
  btn.disabled = false;
  btn.addEventListener('click', onSilentClick);
})
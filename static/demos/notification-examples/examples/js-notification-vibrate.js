async function onVibrateClick() {
  const reg = await getSW();
  /**** START vibrateNotification ****/
  const title = 'Vibrate Notification';
  const options = {
    // Star Wars shamelessly taken from the awesome Peter Beverloo
    // https://tests.peter.sh/notification-generator/
    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]
  };
  reg.showNotification(title, options);
  /**** END vibrateNotification ****/
}

function isVibrateSupported() {
  return ('vibrate' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isVibrateSupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-vibrate');
  btn.disabled = false;
  btn.addEventListener('click', onVibrateClick);
})
async function onSoundClick() {
  const reg = await getSW();
  /**** START soundNotification ****/
  const title = 'Sound Notification';
  const options = {
    sound: '/demos/notification-examples/audio/notification-sound.mp3'
  };
  reg.showNotification(title, options);
  /**** END soundNotification ****/
}

function isSoundSupported() {
  return ('sound' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isSoundSupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-sound');
  btn.disabled = false;
  btn.addEventListener('click', onSoundClick);
})
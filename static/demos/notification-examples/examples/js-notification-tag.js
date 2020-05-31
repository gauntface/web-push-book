async function onTagClick() {
  const reg = await getSW();
  /**** START tagNotificationOne ****/
  let title = 'Notification 1 of 3';
  let options = {
    body: 'With \'tag\' of \'message-group-1\'',
    tag: 'message-group-1'
  };
  reg.showNotification(title, options);
  /**** END tagNotificationOne ****/

  await sleep(NOTIFICATION_DELAY);

  /**** START tagNotificationTwo ****/
  title = 'Notification 2 of 3';
  options = {
    body: 'With \'tag\' of \'message-group-2\'',
    tag: 'message-group-2'
  };
  reg.showNotification(title, options);
  /**** END tagNotificationTwo ****/

  await sleep(NOTIFICATION_DELAY);

  /**** START tagNotificationThree ****/
  title = 'Notification 3 of 3';
  options = {
    body: 'With \'tag\' of \'message-group-1\'',
    tag: 'message-group-1'
  };
  reg.showNotification(title, options);
  /**** END tagNotificationThree ****/
}

function isTagSupported() {
  return ('tag' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isTagSupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-tag');
  btn.disabled = false;
  btn.addEventListener('click', onTagClick);
})
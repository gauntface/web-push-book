async function onTimestampClick() {
  const reg = await getSW();
  /**** START timestampNotification ****/
  const title = 'Timestamp Notification';
  const options = {
    body: 'Timestamp is set to "01 Jan 2000 00:00:00".',
    timestamp: Date.parse('01 Jan 2000 00:00:00')
  };
  reg.showNotification(title, options);
  /**** END timestampNotification ****/
}

function isTimestampSupported() {
  return ('timestamp' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isTimestampSupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-timestamp');
  btn.disabled = false;
  btn.addEventListener('click', onTimestampClick);
})
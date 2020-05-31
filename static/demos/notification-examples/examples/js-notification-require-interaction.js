async function onReqInterClick() {
  const reg = await getSW();
  /**** START requireInteraction ****/
  const title = 'Require Interaction Notification';
  const options = {
    body: 'With "requireInteraction: \'true\'".',
    requireInteraction: true
  };
  reg.showNotification(title, options);
  /**** END requireInteraction ****/
}

function isReqInterSupported() {
  return ('requireInteraction' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isReqInterSupported()) {
    return;
  }

  const btn = document.querySelector('.js-notification-require-interaction');
  btn.disabled = false;
  btn.addEventListener('click', onReqInterClick);
})
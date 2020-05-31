async function onDataClick() {
  const reg = await getSW();
  /**** START addNotificationData ****/
  const title = 'Notification with Data';
  const options = {
    body: 'This notification has data attached to it that is printed ' +
      'to the console when it\'s clicked.',
    tag: 'data-notification',
    data: {
      createdAt: new Date(Date.now()).toString(),
      message: 'Hello, World!'
    }
  };
  reg.showNotification(title, options);
  /**** END addNotificationData ****/
}

window.addEventListener('load', () => {
  const btn = document.querySelector('.js-data-notification');
  btn.disabled = false;
  btn.addEventListener('click', onDataClick);
})
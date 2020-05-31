async function onFocusWindowClick() {
  const reg = await getSW();
  const title = 'Focus or Open a Window';
  const options = {
    body: 'Clicking on this notification will focus on an open window ' +
      'otherwise open a new one.',
    tag: 'focus-window'
  };
  reg.showNotification(title, options);
}

window.addEventListener('load', () => {
  const btn = document.querySelector('.js-focus-window');
  btn.disabled = false;
  btn.addEventListener('click', onFocusWindowClick);
})
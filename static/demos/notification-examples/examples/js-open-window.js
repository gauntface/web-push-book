async function onOpenWindowClick() {
  const reg = await getSW();
  const title = 'Open a Window';
  const options = {
    body: 'Clicking on this notification will open a new tab / window.',
    tag: 'open-window'
  };
  reg.showNotification(title, options);
};

window.addEventListener('load', () => {
  const btn = document.querySelector('.js-open-window');
  btn.disabled = false;
  btn.addEventListener('click', onOpenWindowClick);
})
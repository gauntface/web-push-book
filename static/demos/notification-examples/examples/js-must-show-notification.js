async function onMustShowNotClick() {
  const reg = await getSW();
  
  await sleep(4000);

  const serviceWorker = reg.install || reg.waiting || reg.active;
  serviceWorker.postMessage('must-show-notification-demo');
}

window.addEventListener('load', () => {
  const btn = document.querySelector('.js-must-show-notification');
  btn.disabled = false;
  btn.addEventListener('click', onMustShowNotClick);
})
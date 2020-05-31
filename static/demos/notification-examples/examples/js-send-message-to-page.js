async function onSendMsgToPage() {
  const reg = await getSW();
  
  await sleep(4000);

  const serviceWorker = reg.install || reg.waiting || reg.active;
  serviceWorker.postMessage('send-message-to-page-demo');
}

const setUpSWMessageListener = function() {
  /**** START swMessageListener ****/
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Received a message from service worker: ', event.data);
  });
  /**** END swMessageListener ****/
};

window.addEventListener('load', () => {
  setUpSWMessageListener();

  const btn = document.querySelector('.js-send-message-to-page');
  btn.disabled = false;
  btn.addEventListener('click', onSendMsgToPage);
})
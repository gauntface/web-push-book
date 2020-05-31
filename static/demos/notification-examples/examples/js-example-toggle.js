const NOTIFICATION_DELAY = 2500;

function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

async function enableExamples() {
  const result = await Notification.requestPermission();
  if (result == 'granted') {
    await registerSW();
  }
}

async function disableExamples() {
  const sw = await getSW();
  if (sw) {
    await sw.unregister();
  }
}

async function toggleChange(e) {
  e.preventDefault();
  const chk = e.target;
  chk.disabled = true;

  if (chk.checked) {
    await enableExamples();
  } else {
    await disableExamples();
  }
  await updateState();
}

async function registerSW() {
  await navigator.serviceWorker.register('/demos/notification-examples/service-worker.js');
}

function getSW() {
  return navigator.serviceWorker.getRegistration('/demos/notification-examples/service-worker.js');
}

async function updateState() {
  const examples = document.querySelector('.js-examples-container');
  const chk = document.querySelector('.js-example-toggle');

  const status = await navigator.permissions.query({
    name:'notifications',
  });
  switch(status.state) {
    case 'denied':
      // We are blocked from requesting permission.
      chk.checked = false;
      chk.disabled = true;
      break;
    case 'granted':
      // We have permissions
      const sw = await getSW();
      if (sw) {
        sw.update();
      }
      chk.checked = sw != null;
      chk.disabled = false;
      break;
    default:
      // We need to request permission
      chk.checked = false;
      chk.disabled = false;
      break;
  }

  if (chk.checked) {
    examples.classList.remove('c-examples--hidden');
  } else {
    examples.classList.add('c-examples--hidden');
  }
}

function isSupported() {
  if (!('serviceWorker' in navigator)) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    return false;
  }

  if (!('PushManager' in window)) {
    // Push isn't supported on this browser, disable or hide UI.
    return false;
  }

  return true;
}

window.addEventListener('load', () => {
  if (!isSupported()) {
    return
  }
  const chk = document.querySelector('.js-example-toggle');
  chk.addEventListener('change', toggleChange);
  updateState();
})
async function onImageClick() {
  const reg = await getSW();
  /**** START imageNotification ****/
  const title = 'Image Notification';
  const options = {
    image: '/demos/notification-examples/images/unsplash-farzad-nazifi-1600x1100.jpg'
  };
  reg.showNotification(title, options);
  /**** END imageNotification ****/
}

function isImageSupported() {
  return ('image' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isImageSupported()) {
    return;
  }
  
  const btn = document.querySelector('.js-notification-image');
  btn.disabled = false;
  btn.addEventListener('click', onImageClick);
})
async function onAllCommonClick() {
  const title = 'Web Push Book';
  const options = {
    body: 'This would be the body text of the notification.\n' +
      'It can hold two lines of text.',
    icon: '/demos/notification-examples/images/icon-512x512.png',
    badge: '/demos/notification-examples/images/badge-128x128.png',
    image: '/demos/notification-examples/images/unsplash-farzad-nazifi-1600x1100.jpg',
    tag: 'example-notification',
    actions: [
      {
        action: 'download-book-action',
        title: 'Download Book',
        icon: '/demos/notification-examples/images/action-download-book-128x128.png'
      }
    ]
  };
  const reg = await getSW();
  reg.showNotification(title, options);
}

window.addEventListener('load', () => {
  const btn = document.querySelector('.js-notification-overview');
  btn.disabled = false;
  btn.addEventListener('click', onAllCommonClick);
})
async function onShortTitleClick() {
  const reg = await getSW();
  /**** START titleAndBodySimple ****/
  const title = 'Simple Title';
  const options = {
    body: 'Simple piece of body text.\nSecond line of body text 👍'
  };
  reg.showNotification(title, options);
  /**** END titleAndBodySimple ****/
}

async function onLongTitleClick() {
  const reg = await getSW();
  const title = 'Ice cream dragée croissant gingerbread topping carrot cake ' +
      'cookie biscuit macaroon. Chocolate bonbon sweet roll pastry. ' +
      'Croissant cake jelly-o halvah. Tootsie roll muffin croissant bear claw.';
    const options = {
      body: 'Lollipop cheesecake sesame snaps marshmallow chocolate bar. ' +
        'Pie fruitcake soufflé toffee lemon drops bonbon candy. ' +
        'Pie cupcake icing candy marzipan chocolate. ' +
        'Soufflé candy canes wafer. Tiramisu sweet roll brownie gummies ' +
        'sweet roll icing donut cake. Gummies croissant caramels pastry ' +
        'gingerbread dessert brownie gingerbread. Tiramisu carrot cake ' +
        'jujubes pie brownie sesame snaps.'
    };
    reg.showNotification(title, options);
}

function isTitleBodySupported() {
  return ('title' in Notification.prototype) &&
    ('body' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isTitleBodySupported()) {
    return;
  }

  const shortBtn = document.querySelector('.js-notification-title-body');
  shortBtn.disabled = false;
  shortBtn.addEventListener('click', onShortTitleClick);

  const longBtn = document.querySelector('.js-notification-long-title-body');
  longBtn.disabled = false;
  longBtn.addEventListener('click', onLongTitleClick);
})
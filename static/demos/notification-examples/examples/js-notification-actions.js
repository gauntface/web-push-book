async function onActionsClick() {
  const reg = await getSW();
  /**** START actionsNotification ****/
  const title = 'Actions Notification';
  const options = {
    actions: [
      {
        action: 'coffee-action',
        title: 'Coffee',
        icon: '/demos/notification-examples/images/action-1-128x128.png'
      },
      {
        action: 'doughnut-action',
        title: 'Doughnut',
        icon: '/demos/notification-examples/images/action-2-128x128.png'
      },
      {
        action: 'gramophone-action',
        title: 'gramophone',
        icon: '/demos/notification-examples/images/action-3-128x128.png'
      },
      {
        action: 'atom-action',
        title: 'Atom',
        icon: '/demos/notification-examples/images/action-4-128x128.png'
      }
    ]
  };

  const maxVisibleActions = Notification.maxActions;
  if (maxVisibleActions < 4) {
    options.body = `This notification will only display ` +
      `${maxVisibleActions} actions.`;
  } else {
    options.body = `This notification can display up to ` +
      `${maxVisibleActions} actions.`;
  }

  reg.showNotification(title, options);
  /**** END actionsNotification ****/
}

function isActionsSupported() {
  return ('actions' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isActionsSupported()) {
    return;
  }
  
  const btn = document.querySelector('.js-notification-actions');
  btn.disabled = false;
  btn.addEventListener('click', onActionsClick);
})
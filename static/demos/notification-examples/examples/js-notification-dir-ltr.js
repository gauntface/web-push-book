async function onLTRClick() {
  const reg = await getSW();
  /**** START dirLTRNotification ****/
  const title = 'Direction LTR Notification';
  const options = {
    body: 'Simple piece of body text.\nSecond line of body text 👍',
    dir: 'ltr',
    actions: [{
      title: 'Action 1',
      action: 'action-1'
    }, {
      title: 'Action 2',
      action: 'action-1'
    }]
  };
  reg.showNotification(title, options);
  /**** END dirLTRNotification ****/
}

async function onRTLClick() {
  const reg = await getSW();
  /**** START dirRTLNotification ****/
  const title = 'المغلوطة حول استنكار  النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤ.';
  const options = {
    body: 'المغلوطة حول استنكار  النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤ.',
    dir: 'rtl',
    actions: [{
      title: 'الصف 1 العمود 1',
      action: 'action-1'
    }, {
      title: 'الصف 1 العمود 2',
      action: 'action-2'
    }]
  };
  reg.showNotification(title, options);
  /**** END dirRTLNotification ****/
}

function isDirSupported() {
  return ('dir' in Notification.prototype);
}

window.addEventListener('load', () => {
  if (!isDirSupported()) {
    return;
  }

  const ltrBtn = document.querySelector('.js-notification-dir-ltr');
  ltrBtn.disabled = false;
  ltrBtn.addEventListener('click', onLTRClick);

  const rtlBtn = document.querySelector('.js-notification-dir-rtl');
  rtlBtn.disabled = false;
  rtlBtn.addEventListener('click', onRTLClick);
})
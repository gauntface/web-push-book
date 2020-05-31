let msgIndex = 0;
const exampleMessages = [
  'Heyo',
  'Hows it goin?',
  'What you been up to?',
  'These aren\'t real messages.',
];

const userIcon = '/demos/notification-examples/images/matt-512x512.png';
const userName = 'Matt';

async function onMergeClick() {
  const reg = await getSW();
  const userMessage = exampleMessages[msgIndex];

  /**** START getNotifications ****/
  const notifications = await reg.getNotifications();
  let currentNotification;
  for(let i = 0; i < notifications.length; i++) {
    if (!notifications[i].data ||
      notifications[i].data.userName !== userName) {
      continue
    }
    currentNotification = notifications[i];
  }
  /**** END getNotifications ****/
  /**** START manipulateNotification ****/
  let title = `New Message from ${userName}`;
  const options = {
    body: `"${userMessage}"`,
    icon: userIcon,
    data: {
      userName: userName,
      newMessageCount: 1
    },
  }

  if (currentNotification) {
    // We have an open notification, let's do something with it.
    title = `New Messages from ${userName}`;

    const messageCount = currentNotification.data.newMessageCount + 1;
    options.body = `You have ${messageCount} new messages from ${userName}.`;
    options.data.newMessageCount = messageCount;

    // Remember to close the old notification.
    currentNotification.close();
  }
  reg.showNotification(title, options);
  /**** END manipulateNotification ****/

  msgIndex++;
  if (msgIndex >= exampleMessages.length) {
    msgIndex = 0;
  }
}

window.addEventListener('load', () => {
  const btn = document.querySelector('.js-merge-notification');
  btn.disabled = false;
  btn.addEventListener('click', onMergeClick);
})
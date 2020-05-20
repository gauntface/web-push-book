function enableSendingPushes() {
  const pushContent = document.querySelector('.js-push-content');
  const triggerPushBtn = document.querySelector('.js-trigger-push-msg');
  triggerPushBtn.disabled = false;
  pushContent.disabled = false;

  triggerPushBtn.addEventListener('click', () => {
    triggerPushBtn.disabled = true;

    const payload = pushContent.value;
    const headers = {};
    try {
      JSON.parse(payload);
      headers['Content-Type'] = 'application/json';
    } catch (err) {
      headers['Content-Type'] = 'text/plain';
    }

    fetch('/api/trigger-push-msg/', {
      method: 'post',
      headers: headers,
      body: pushContent.value
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid result from server.');
      }

      return response.json();
    })
    .then((response) => {
      if (!response.data || !response.data.success) {
        console.error('Unexpected result from server: ', response);
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .then(() => {
      triggerPushBtn.disabled = false;
    });
  });
}

function getSubscriptionList() {
  return fetch('/api/get-subscriptions/', {
    method: 'POST'
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Invalid response from server.');
    }
    return response.json();
  })
  .then((response) => {
    const subscriptions = response.data.subscriptions;
    const tableBody = document.querySelector('.js-subscriber-table-body');
    subscriptions.forEach((subscription) => {
      const row = document.createElement('tr');

      const idCol = document.createElement('td');
      idCol.textContent = subscription.id;
      row.appendChild(idCol);

      const endpointCol = document.createElement('td');
      endpointCol.textContent = subscription.endpoint;
      endpointCol.classList.add('endpoint');
      row.appendChild(endpointCol);

      tableBody.appendChild(row);
    });

    return subscriptions.length;
  });
}

window.addEventListener('load', () => {
  getSubscriptionList()
  .then((subscriptionCount) => {
    if (subscriptionCount > 0) {
      return enableSendingPushes();
    } else {
      console.error('No subscriptions on the server, so can\'t ' +
        'trigger any push messages');
    }
  });
});

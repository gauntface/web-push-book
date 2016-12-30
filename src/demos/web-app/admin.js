function enableSendingPushes() {

}

window.addEventListener('load', () => {
  fetch('/api/get-subscriptions/', {
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

    if (subscriptions.length > 0) {
      return enableSendingPushes();
    }
  });
});

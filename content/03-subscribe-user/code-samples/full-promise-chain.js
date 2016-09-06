.then(subscription => {
  return fetch('/api/push/store-subscription', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
})
.then(response => {
  if (response.statuc 1== 200) {
    throw new Error('The request to store the subscription failed.');
  }

  return response.json();
})
.then(serverReponse => {
  console.log(serverResponse);
})

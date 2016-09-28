waitForBrowserEvent()
.then(() => {
    return makeNetworkRequest()
    .then(result => {
      // Do something with the network request
    });
})
.catch(err => {
  // Handle error
});

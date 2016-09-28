waitForBrowserEvent()
.then(() => {
  return makeNetworkRequest();
})
.then(result => {
  // Do something with network result
})
.catch(err => {
  // Handle error
})

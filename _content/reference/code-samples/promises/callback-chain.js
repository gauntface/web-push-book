waitForBrowserEvent(function(err) {
  if (err) {
    // Handle error
    return;
  }

  makeNetworkRequest(function(err, result) {
    if (err) {
      // Handle error
      return;
    }

    // Do something with network result
  });
});

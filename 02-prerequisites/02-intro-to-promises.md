# Prerequisites

Before we look at the specifics of how to do the 3 steps discussed, it's
worth covering some key aspects of the API that might be new to some
developers.

If you are comfortable with promises and / or service workers then you should
skip section, but if either of those topics are new to you, it's worth
covering some of the fundamentals because in the rest of the book it'll be
glossed over.

## Intro to Promises

Promises are a way of handling asynchronous code in a different manner to
callbacks.

You might be used to code that looks like this:

    someAPI(function((err, result) {
      if (err) {
        // Do something with the error
        return;
      }

      // Do something with the result
    });

This was easy to use and worked well. The only downside is that error cases
weren't standardardised and it can lead to heavy nesting of function calls.

Promises is essentially a standardised why of approaching asynchronous method
that can simplify APIS. Te equivalent promise of the code above is as
follows:

    someAPI()
    .then(result => {
      // Do something with the result
    })
    .catch(err => {
      // Do something with the error
    })

The difference is minor, the result and error are seperated via the `then` and
`catch` method, both passing in a callback function.

The major benefit of promises is that your can *chain* promises together by
returning a promise inside of a promises callback.

Let's say we were making waiting for a browser event and afterwards we wanted
to make a network request, if we were using callbacks, we would do the
following:

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

With promises we can chain them by returning a promise inside of a  promise
callback:

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

This should be enough on promises to get you through the reast of this book,
but it's not clear, I strongly recommend Jake Archibalds introduction to
Promises, he covers a tonne of examples and
usecases^[https://developers.google.com/web/fundamentals/primers/promises/].

## Intro to Service Worker

---
title: Quick Look at ES2015
---
# Quick Look at ES2015

Before we look at the specifics of how to do the 3 steps discussed, it's
worth covering some key aspects of the API that might be new to some
developers.

If you are comfortable with promises and / or service workers then you should
skip section, but if either of those topics are new to you, it's worth
covering some of the fundamentals because in the rest of the book it'll be
glossed over.

## ES2015

If you are new to ES2015, here is the mega short run through of features
/ syntax I'll be using in this book.

### Fat Arrow Functions

Fat arrow functions look weird, but aren't too bad once you get the hand of
them.

A normal function is:

``` javascript
function() {
  // Do codez here
}
```
<% include('./code-samples/es2015/js-function.js') %>

The equivalent fat arrow function is:

``` javascript
() => {
  // Do codez here
}
```
<% include('./code-samples/es2015/fat-arrow-function.js') %>

If you have multiple arguments passed in, you go from:

``` javascript
function(arg1, arg2) {
  // Do codez here
}
```
<% include('./code-samples/es2015/js-function-with-args.js') %>

To fat arrow this:

``` javascript
(arg1, arg2) => {
  // Do codez here
}
```
<% include('./code-samples/es2015/fat-arrow-function-with-args.js') %>

The last final thing to master, if there is only one argument, you don't need
the brackets:

``` javascript
arg1 => {
  // Do codes here
}
```
<% include('./code-samples/es2015/fat-arrow-function-single-arg.js') %>

### var vs const and let

In JavaScript `var` is used to define new variables. In ES2015, you can
use `const` and `let` instead.

`let` is the same as var. It's a variable that can be re-assigned as many
times as you like.

`const` is a variable that can only be assigned once. The object itself can
be mutated and altered, it just can't be re-assigned.

The subtleties of this were covered in an excellent article by Mathias Bynens
that I'd strongly recommend you check out for more
info^[https://mathiasbynens.be/notes/es6-const].

## Intro to Promises

Promises are a way of handling asynchronous code in a different manner to
callbacks.

You might be used to code that looks like this:

``` javascript
someAPI(function((err, result) {
  if (err) {
    // Do something with the error
    return;
  }

  // Do something with the result
});
```
<% include('./code-samples/promises/callback-function.js') %>

This was easy to use and worked well. The only downside is that error cases
weren't standardised and it can lead to heavy nesting of function calls.

Promises is essentially a standardised why of approaching asynchronous method
that can simplify APIS. Te equivalent promise of the code above is as
follows:

``` javascript
someAPI()
.then(result => {
  // Do something with the result
})
.catch(err => {
  // Do something with the error
})
```
<% include('./code-samples/promises/basic-promise.js') %>

The difference is minor, the result and error are separated via the `then` and
`catch` method, both passing in a callback function.

The major benefit of promises is that your can *chain* promises together by
returning a promise inside of a promises callback.

Let's say we were making waiting for a browser event and afterwards we wanted
to make a network request. Using callbacks, we would do the
following:

``` javascript
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
```
<% include('./code-samples/promises/callback-chain.js') %>

With promises we can chain them by returning a promise inside of a  promise
callback:

``` javascript
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
```
<% include('./code-samples/promises/promise-chain.js') %>

This should be enough on promises to get you through the rest of this book,
but it's not clear, I strongly recommend Jake Archibalds introduction to
Promises, he covers a tonne of examples and
usecases^[https://developers.google.com/web/fundamentals/primers/promises/].

On a personal note, I found it really helpful to flatten my promise chains.
By this, what I mean is that even though you can do this:

``` javascript
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
```
<% include('./code-samples/promises/nested-promise-chain.js') %>

Generally I've found it cleaner and easier to follow a Promise chaing, if you
pass the result onto the next step rather than nest Promise chains.

## Intro to Service Worker

Final thing I wanted to cover was service workers and this will really be a
high level run through as I'll be mentioning service workers **a lot**
throughout this book.

Every developer is (or eventually becomes) happy with the notion that
JavaScript runs inside of a web page.

![A browser with a web page loaded and JavaScript running inside of that page](/images/png-version/browser-with-javascript.png)

What the service work API does is it gives you a way to make the browser
aware of "special" JavaScript files that run separately from the page. These
JavaScript files can run while your web page is closed or even when the
user's browser window is closed.

![A browser a service worker running separate from the page or running while the browser is closed](/images/png-version/browser-with-serviceworker.png)

With this, browsers have been able to add new API's to service worker files,
including:

- Push notifications (of course)
- Support for network interception and manipulation (i.e. offline support)
- Background Sync (ability to make a network request if the initial
  request fails due to being offline)

Ultimately, service workers are a type of JavaScript worker and as a result
have many of the API's you'd have in a worker.

Like I said, we'll cover this in more detail later on in the book, just
remember that a service worker script can run without your page being open.

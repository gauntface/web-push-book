---
title: Testing
---
# Testing

We should write tests for our web apps and the more we code we can cover, the
more confidence we'll have our product, so how do we test push?

There are few ways to approach this. We can mock / fake the API's we want to
use and this is normally a very fast way to test your API and very easy way to
test uncommon / unexpected code paths, but it has the downside of being
only as good as the mocks you use.

Integration tests, or using an actual browser using selenium, are much closer
to what you can expect a user to experience, but has the down side but these
tests can be flakey and slow.

In this chapter we'll look at how we might approach both of these styles of
testing and you should think about where you want to draw the line, personally
I think both have value.

## Mocks

// TODO Write up mocks for push and illustrate how to used them

## Integration Tests

The alternative (or additional) testing is integration testing with selenium
and there are different ways we can test push / notifications depending on
what you are trying to test.

### Testing Notification Logic

### Testing Subscription Logic

### Testing Subscribing Logic

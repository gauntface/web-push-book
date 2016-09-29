sendSubscriptionDetailsToServer({
  endpoint: subscription.endpoint,
  p256sh: subscription.getKey('p256sh'),
  auth: subscription.getKey('auth')
})

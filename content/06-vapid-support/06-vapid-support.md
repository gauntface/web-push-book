---
---
# VAPID Support

VAPID stands for 'Voluntary Application Identification' // TODO Check this is correct
which basically means that its a way a developers application
server can identify and prove they are who they say they are. In this chapter
we'll look at how to implement VAPID.

When you decide you want to implement web push, start off by creating
a public and private key pair that will serve as your application server keys.
These need to be // TODO: Note down the specifics of the certificate type and key size

These application server keys can be thought of as VAPID keys, but I'll refer
to them as application server keys.

When you call `subscribe()` you can pass in an `applicationServerKey`,
which'll be the public key for your server.

    const publicApplicationServerKey = new Uint8Array([0, 1, 2, 3, // TODO: How best to show this?]);
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicApplicationServerKey
      })

By doing this, are telling the browser and the push service that your
server can be identified using this public key and only this public key.

The subscription you get back will be like any other subscription.

---
title: Browser Differences
---
# Browser Differences

If you run the code in the previous section, at the time of writing, it will
only work in Firefox. The reason for which is a little messy, so bare with
me through this next section.

## Google Cloud Messaging

The other push supporting browsers at the time of writing,
Chrome, Opera for Android and Samsung Browser will throw this error is if
you were to implement the code you just looked over.

    // TODO: Show error message when no gcm_sender_id set

This is because these browsers use a push service called Google Cloud Messaging
(a.k.a. GCM) which requires a 'sender ID' when subscribing a user to push.
This 'sender ID' is given to a developer when they create a Google Developer
Account, or more recently a Firebase account. First let's look at getting
a sender ID.

### Getting a GCM Sender ID

The easiest way to get a sender ID is to create a new Firebase project at
[https://firebase.google.com](https://firebase.google.com/).

    // TODO: Add screenshot of firebase.google.com

Go through the required steps to create a new project by ...........

    // TODO: Add instructions to step through creating a new project
    // TODO: Add images of new project flow

Once you've got to the project page, go to the setting page (it's the cog to
the right of the project name).

    /// TODO: Show location of cog

Then click on the 'Cloud Messaging Tab'

    // TODO: Show location of the Cloud Messaging Tab

There you have it, your 'Sender ID'.

    // Highlight the sender ID

The way you give these browsers the sernder ID is via a Web App Manifest.

### Adding a Web App Manifest

A web app manifest is a JSON file browsers can use to gain extra information
about your web app, this includes meta data like your web app / site's name,
icons, theme colors and other goodies (To learn more about these, check out
Jake Archibald's talk from Google I/O 2016: // TODO Add LINK HERE).

All we need for this is a simple JSON file with the field "gcm_sender_id"
in it and assign the Sender ID from your firebase project, like this:

``` javascript
{
  "gcm_sender_id": "//TODO: Add Sender ID Here"
}
```
<% include('./code-samples/manifest_gcm_sender_id.json') %>

Save this to a file somewhere on your site, for this let's assume its at
'/manifest.json'.

To make the browser aware that you have a manifest and where it's living, we
just need to add it in the `head` of our page with a link tag.

``` javascript
<link rel="manifest" href="/manifest.json">
```
<% include('./code-samples/manifest-tag.html') %>

With this set up you can try subscribing again and fingers crossed it'll work.

Google Cloud Messaging does require an extra step when making a network request
but I'll cover that in the relevant section.

# Opera

One thing to callout with Opera is that at the time of writing push is supported
on their Android browser. On Desktop the API's are visible, but once you
call subscribe, it will reject. There is no way of feature detecting this, sadly
you either detect you are in Opera with user agent sniffing or simply let users
go through your UI to enable push and fail at that point.

# Lack of Encrypted Data Support

At the time of writing Samsung Browser doesn't support data with push messages.
This can also be the case with new browsers as they start to support web push.
This isn't necessarily a bad thing as you can make an API call when
a push message is received, but for some this causes a great deal of
complication, so if you fit into that bracket, you may want to feature detect
support for payload before offering it to your users.

I think the best way to feature detect this is by check for 'getKeys' on the
Push Subscription Object. This method is used for getting the `p256dh` and
`auth` keys we saw in the `PushScription`. If that method doesn't exist, chances
are encrypted data won't be supported

    // TODO: Give example of checking for getKeys on PushSubscription

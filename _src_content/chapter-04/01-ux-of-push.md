---
title: UX of Push on the Web
---
# UX of Push on the Web

Before I moved on to how to send a push to the user, this feels like the right
time to briefly cover the UX when subscribing a user to push.

I don't know if you've ever visited Google on your device and been confronted
with this experience.

    // TODO Add image of Google showing geolocation permission

I hate this. When I land on a web page I normally have an intention, in the
case of Google, doing a search. Instead of being allowed to do that, this
brick wall is put up asking for permission, it just sucks from a user
perspective.

With the `Notification` API you can control when the user is shown this
permission prompt and you should give some consideration to when you show. If
you display it and the user selects 'block', you will never be able to ask for
permission again. Instead the user has to find the right UI (often hidden and
not intuitive) to re-enable the permissions.

    // TODO: Show image of the UI for enabling notifications on Desktop and Mobile

## Common Patterns

Here are some common patterns that are good recommendations when asking the
user for permission.

### Relevant Location

I think one of the easiest ways to offer push to a user is to have a button
or toggle to enable / disable push messages to the user in a location
on your page that makes sense.

Facebook asks for push in the messaging tray of their web app.

    // TODO: Add screenshot of Facebook push

This is a nice pattern as given the context, users can guess / assume what
they are signing up for.

### Value Proposition

One great option for getting a user to subscribe for push is by giving a
clear incentive at an opportune time.

If a user has just bought an item, you can offer push notification updates
on the delivery status.

A user bidding on an auction can get updates on new bids and close to
the closing of the bids.

Purchasing a flight ticket can result in offering status updates in case the
flight is delayed etc.

These are all points where the user has invested in your service and there
is a value you can offer to the user.

// TODO: Example of Value Proposition UI

### Guided flow

A common pattern to avoid having your permission blocked permenantly is to
ask the user if they would like to enable push notification using a custom
UI in your web page, before actually requesting the browser permission. This
way if the user doesn't allow your UI, you can simply not show the Notification
permission and you won't be blocked.

// TODO Example of custom UI

## Offer a Way Out

Aside from UX to subscribe a user to push, please consider how a user can
unsubscribe. The number of sites that simply don't allow users to disable
push notificiations is astounding.

I'm a big fan of always offering the user a way to disable push notifcations
in the same place they enabled them, but that's largely because I'm a simple
person who likes things to be simple. Telling your users they can disable push
in a settings panel or some other common location should be something
you offer. Again the alternative is the user taking the nuclear option and
revoking permissions, which is the worst experience for the user, blocks
your site from getting push in the future and reflects poorly on the service.

Ultimately, all I ask is that you don't just call `registration.subscribe()`
or `Notification.requestPermission()` when the page first loads up and that
you offer a way to undo that if the user wants to.

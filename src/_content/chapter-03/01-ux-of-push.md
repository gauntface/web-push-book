---
title: UX of Push on the Web
---
# UX of Push on the Web

Before we move on to how to trigger a push message we should look at some
best practice for the UX of requesting permission for a user.

## The Worst UX

The very worst thing you can do is instantly show the permission dialog as
soon as the user lands on your website.

They have zero context on why they are being asked for a permission, they
may not even know what your website is, does or offers and just landing on a
site, they could block you just out of frustration from being bombarded with
a pop-up.

As I mentioned before, if the user *blocks* the permission request, your
web app can't ask for permission again and it's pretty difficult for a user
to change the permission after they've blocked it as well.

No matter what, don't just ask for permission as soon as the user opens your
site, instead consider something else that makes sense for your user.

## Common Patterns

Here are some common patterns that are good approaches when asking the
user for permission.

### Value Proposition

Encouraging a user to subscribe to push messaging at a time where the benefit
is obvious given the current context is a fantastic way to get users to grant
permission.

For example, a user has just bought an item on your and finished the checkout
flow, you can offer push notification updates on the delivery status.

But these kind of situations can be common:
- A particular item is out of stock, would you like to notified when it's next
available?
- This breaking new story will be regularly updated, would you like to be
notified as the story develop?
- You're the highest bidder of this item, would you like to be notified if you
are outbid?

These are all points where the user has invested in your service and there
is a clear value proposition to them if they enable push notifications.

Owen Campbell-Moore put this perfectly with a mock scenario of an airline's
web site.

The first example is of the **bad UX**, requesting permission as soon as a user
lands on an airlines website.

![Owen Campbell-Moore's example of bad UX for push.](/images/ux-examples/owen/owen-bad-ux.png){: .device-image .center-image }

The alternative is to offer a value proposition, like asking the user if they
want notifications in case of flight delays.

![Owen Campbell-Moore's example of good UX for push.](/images/ux-examples/owen/owen-good-example.png){: .device-image .center-image }

Finally, a nice example of managing the user experience by covering up the
sites content with a semi-transparent cover forces the user to focus on the
permission prompt.

![Owen Campbell-Moore's example of good UX for the permission prompt.](/images/ux-examples/owen/owen-permission-prompt.png){: .device-image .center-image }

### Double Permission

You may feel that your site has a clear benefit to push messaging as soon
as a user has signed up for your service. If that's the case, it's worth
considering the double permission of push.

With this approach you display custom permission prompt in your web
app that asks the user to enable notifications. By
doing this the user can say enable or disable without the website being
permanently blocked since they are only using the websites UI. If
the user selects enable on the custom UI, display the actual permission prompt.

A good example of this is [Slack](https://slack.com/), they show a prompt at
the top of their page asking if you'd like to enable notifications.

![Example of slack.com showing custom banner for permission to show notifications.](/images/ux-examples/slack/slack-permission-banner.png)

If the user clicks accept, the actual permission prompt is shown:

![Actual permission prompt on slack.com.](/images/ux-examples/slack/slack-permission-prompt.png)

It's also worth calling out slacks cute notification they display when they
enabled.

![Cute "It's working" notification from slack.com.](/images/ux-examples/slack/slack-welcome-notification.png)

### Settings Panel

You can move notifications into a settings panel, giving users an easy way
to enable and disable push messaging, without the need of cluttering your
web apps UI.

A good example of this is [Google I/O's 2016](
https://events.google.com/io2016/) website. Under the menu setting
they include a clear UI for users to enable notifications and once selected
the permission dialog is shown.

When you first load up the Google I/O site, you aren't asked to do anything,
the user is left to explore the site.

![When you first load the page, no prompt, just calm on Google IO.](/images/ux-examples/google-io/google-io-first-load.png){: .device-image .center-image }

Click the menu item on the right reveals the panel for setting up and managing
notifications.

![Settings panel on Google IO's web app for push messaging.](/images/ux-examples/google-io/google-io-settings-panel.png){: .device-image .center-image }

Click on the checkbox displays the permission prompt, which you'd expect given
the explanation around the checkbox, no hidden surprises.

![Google IO's web app displaying the permission prompt.](/images/ux-examples/google-io/google-io-permission-prompt.png){: .device-image .center-image }

After that the UI is simple checked and the user is good to go. The great thing
about this UX is that it's the same location to disable push as it is to sign
up for push.

This is also something Slack does well, they offer a host of options for
notifications allowing the user to custom what notifications they get as well
as options like the sound made when a notification is received.

![The notification preferences on slack.com easily found under settings drop down.](/images/ux-examples/slack/slack-prefs-dropdown.png)

![The settings panel for notifications on slack.com.](/images/ux-examples/slack/slack-notification-settings.png)

### Passive Approach

One of the easiest ways to offer push to a user is to have a button
or toggle switch that enables / disables push messages in a location
on the page that in consistent throughout your site.

This is unlikely to drive users to enable push notifications, but consistency
and allowing users to opt in and out easily without constant nudging gives
users a way to engage more with your brand if and when they want. For sites
like blogs that might have some regular viewers as well as high bounce rates,
this is a solid option.

On my personal site I have a footer the has a toggle switch for push messaging.

![Example of Gauntface.com push notification toggle in footer.](/images/ux-examples/gauntface/gauntface-intro.png)

It's fairly out of the way, but for regular visitors it should get enough
attention that anyone wanting to get updates will sign up and people
just landing on my site for some information are completely unaffected.

If you grant permission the state of the toggle switch simply changes, being
another example of the same location for enabling and disabling push.

![Example of Gauntface.com with notifications enabled.](/images/ux-examples/gauntface/gauntface-enabled.png)

### Offer a Way Out

Aside from UX to subscribe a user to push, **please** consider how a user
should unsubscribe / opt out of push messaging.

The number of sites that simply ask for permission as soon as the page loads
and as a result have no UI in their web app to disable push notifications
is astounding.

[Vice News](https://news.vice.com/) is an example of this practice. (p.s. sorry
Vice for using you as an example, you were first site I recalled doing this.)

When you land on Vice News you'll get the permission prompt. This isn't the end
of the world, but it does offend the senses if your just browsing.

![Vice news instantly asks for permission.](/images/ux-examples/vice/vice-instant-notification.png)

*If* you allow notifications, where would you go to disable them? The websites UI changes in no way after a user grants permission.

![Vice news after granting permission.](/images/ux-examples/vice/vice-no-opt-out.png)

This bad UX pushes the responsibility onto the browser, which frankly has an
awful UX in Chrome.

As a result, your brand is getting users signed up, then forcing them to
trial and error their way through the browser UX to disable notifications. This
can't be good for anyone.

If your curious what the Browser UX is, the desktop has two options. You can
visit the web page and select the 'i' button in the URL bar.

![Chrome Notification Permissions from URL Bar.](/images/ux-examples/vice/vice-disable-url-bar.png)

If the web page is closed, users can click the cog on a notification,
which takes the user to this page.

![Chrome Notification Permissions from URL Bar.](/images/ux-examples/vice/vice-disable-in-chrome.png)

Neither of these options are particularly pleasant for the user.

Your site should explain to your users how they can disable push. If you don't,
users are likely to take the nuclear option and block permission permanently.

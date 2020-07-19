---
title: Permission UX
weight: 4
---
# Permission UX

The natural step after getting a `PushSubscription` and saving it our server is to trigger a push message, but there is one thing I flagrantly glossed over. The user experience when asking for permission from the user to send them push messages.

Sadly, very few sites give much consideration to how they ask their user for permission, leading to users [disabling notifications altogether](https://www.theverge.com/2019/7/18/18716041/website-notification-prompts-pop-ups-how-to-stop), so let's take a brief aside to look at both good and bad UX.

## Common Patterns

There have been a few common patterns emerging that should guide you when deciding what is best for your users and use case.

### The Bad UX

**If you remember nothing else, remember this, do not just ask for permission.**

[Browser asking for notification permision](./images/notification-prompt)

The worst thing you can do is instantly show the permission dialog to users as soon as they land on your site.

They have zero context on what notifications will be; they may not even know what your website is for, what it does, or what it offers. Blocking permissions at this point out of frustration is not uncommon, this pop-up is getting in the way of what they are trying to do.

Remember, if the user *blocks* the permission request, your web app can't ask for permission again. To get permission after being blocked, the user has to change the permission in the browsers UI, and doing so is not easy, apparent, or fun for the user.

Ultimately we want to avoid every website becoming this:

<iframe src="https://player.vimeo.com/video/439784831" width="640" height="480" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

[*Source*](https://www.reddit.com/r/ProgrammerHumor/comments/9pp9hj/2018_on_the_web/)

### Good UX

There are several excellent options for requesting permissions, and below are some UX patterns from different companies using web push. 

### Value Proposition

Ask users to subscribe to push at a time when the benefit is obvious.

For example, a user has just bought an item on an online store and finished the checkout flow. The site can then offer updates on the delivery status.

There are a range of situations where this approach works:
- A particular item is out of stock, would you like to be notified when it's next available?
- This breaking news story will be regularly updated, would you like to be notified as the story develops?
- You're the highest bidder, would you like to be notified if you're outbid?

These are all points in a user journey where the user has invested in your service, and there is a clear benefit to enable push notifications.

[Owen Campbell-Moore](https://twitter.com/owencm) created a mock of a hypothetical airline website to demonstrate this approach.

After the user has booked a flight, it asks if the user would like notifications in case of flight delays.

<p class="u-center">
  <img src="/images/ux-examples/owen/owen-good-example.png" alt="Owen Campbell-Moore's example of good UX for push." class="u-device-image" />
</p>

Note that this is a custom UI from the website.

Another nice touch to Owen's demo is that if the user clicks to enable notifications, the site adds a semi-transparent overlay over the entire page when it shows the permission prompt, drawing the users attention to the permission prompt.

<p class="u-center">
  <img src="/images/ux-examples/owen/owen-permission-prompt.png" alt="Owen Campbell-Moore's example of good UX for the permission prompt." class="u-device-image" />
</p>

The alternative to this example, the **bad UX** for asking permission, is to request permission as soon as a user lands on the airline's site.

<p class="u-center">
  <img src="/images/ux-examples/owen/owen-bad-ux.png" alt="Owen Campbell-Moore's example of bad UX for push." class="u-device-image" />
</p>

This approach provides no context as to why notifications are needed or useful to the user while blocking them from achieving their original task of booking a flight.

### Double Permission

You may feel that your site has a clear use case for push messaging and, as a result, want to ask the user for permission as soon as possible.

For example instant messaging and email clients. Showing a notification for a new message or email is an established user experience across various platforms.

For this category of apps, it's worth considering the double permission pattern.

With this approach, you display a custom permission prompt in your web app, asking the user to enable notifications with context on what the app will do with this permission. If the user selects enable on the custom UI, display the actual permission prompt, otherwise hide your custom pop-up and ask some other time.

A good example of this is [Slack](https://slack.com/). They show a prompt at the top of their page once you've signed in, asking if you'd like to enable notifications.

![Example of slack.com showing custom banner for permission to show notifications.](/images/ux-examples/slack/slack-permission-banner.png)

If the user clicks accept, the actual permission prompt is shown:

![Actual permission prompt on slack.com.](/images/ux-examples/slack/slack-permission-prompt.png)

I was also a big fan of Slacks' first notification when you grant the permission.

![Cute "It's working" notification from slack.com.](/images/ux-examples/slack/slack-welcome-notification.png)

### Settings Panel

You can move notifications into a settings panel, giving users an easy way
to enable and disable push messaging, without the need of cluttering your
web app's UI.

A great example of this is [Google I/O's 2016 site](https://events.google.com/io2016/). When you first load up the Google I/O site, there are no pop-ups, the user is left to explore the site.

<p class="u-center">
  <img src="/images/ux-examples/google-io/google-io-first-load.png" alt="When you first load the page, no prompt, just calm on Google IO." class="u-device-image" />
</p>

After a few visits, clicking the menu item on the right reveals a settings panel allowing the user to set up and manage notifications.

<p class="u-center">
  <img src="/images/ux-examples/google-io/google-io-settings-panel.png" alt="Settings panel on Google IO's web app for push messaging." class="u-device-image" />
</p>

Clicking on the checkbox displays the permission prompt—no hidden surprises.

<p class="u-center">
  <img src="/images/ux-examples/google-io/google-io-permission-prompt.png" alt="Google IO's web app displaying the permission prompt." class="u-device-image" />
</p>

Once the user has granted the permission, the checkbox becomes checked, and the user can receive notifications. The great thing about this UI is that users can enable and disable notifications from one location on the website.

Slack also does an excellent job of giving users control over their notifications. They offer a host of options allowing users to customize the notifications they receive.

![The notification preferences on slack.com quickly found under settings dropdown.](/images/ux-examples/slack/slack-prefs-dropdown.png)

![The settings panel for notifications on slack.com.](/images/ux-examples/slack/slack-notification-settings.png)

### Passive Approach

One of the easiest ways to offer push to a user is to have a button
or toggle switch that enables/disables push messages in a location
on the page that is consistent throughout a site.

This UX doesn't drive users to enable push notifications, but offers a reliable and easy way for users to opt-in and out of engaging with your website. For sites like blogs that might have some regular viewers and high bounce rates, this is a solid option as it targets regular viewers without annoying drive-by visitors.

On an old version of my site, I have a toggle switch for push messaging in the footer.

![Example of Gauntface.com push notification toggle in footer.](/images/ux-examples/gauntface/gauntface-intro.png)

It's somewhat out of the way, but for regular visitors, it should get enough attention from readers wanting to get updates. One-time visitors are completely unaffected.

If the user subscribes to push messaging, the state of the toggle switch changes and maintains state throughout the site.

![Example of Gauntface.com with notifications enabled.](/images/ux-examples/gauntface/gauntface-enabled.png)

### Offer a Way Out

Consider how a user can unsubscribe or opt-out of push messaging.

The number of sites that ask for permission as soon as the page load and then offers no UI for disabling push notifications is astounding.

[Vice News](https://news.vice.com/) is an example of this practice. (p.s. sorry Vice for using you as an example; you were the first site I recalled doing this, although I believe it's fixed now.)

When you land on Vice News, it follows the bad UX and requests the notification permission.

![Vice news instantly asks for permission.](/images/ux-examples/vice/vice-instant-notification.png)

*If* you allow notifications, where would you go to disable them? The websites UI doesn't change at all.

![Vice news after granting permission.](/images/ux-examples/vice/vice-no-opt-out.png)

This UX pushes the responsibility of notification management onto the browser, which frankly is awful in Chrome.

As a result, sites get users signed up, forcing them to trial and error their way through the browser UX to disable notifications.

If you're curious about what the Browser UX is for disabling push, the desktop has two options. You can visit the web page and click the padlock in the URL bar to configure permissions.

![Chrome Notification Permissions from URL Bar.](/images/ux-examples/vice/vice-disable-url-bar.png)

If the web page is closed, users can click the cog on a notification,
which takes the user to this page in the settings of Chrome.

![Chrome Notification Permissions from URL Bar.](/images/ux-examples/vice/vice-disable-in-chrome.png)

Neither of these options is particularly pleasant for the user.

Your site should explain to your users how they can disable push. If you don't, users are likely to take the nuclear option and block permission permanently.

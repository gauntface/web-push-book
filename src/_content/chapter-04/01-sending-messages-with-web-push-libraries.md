---
title: Sending Messages with Web Push Libraries
---

# Sending Messages with Web Push Libraries

One of the pain points when working with web push is that trigger a push message is extremely "fiddly". To trigger a push message an application needs to make a POST request to a push service following the [web push protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol). To use push across all browsers you need to use [VAPID](https://tools.ietf.org/html/draft-thomson-webpush-vapid) (a.k.a application server keys) which basically requires setting a header with a value proving your application can message a user. To send data with a push message, the data needs to be [encrypted](https://tools.ietf.org/html/draft-ietf-webpush-encryption) and specific headers added so the browser can decrypt the message correctly.

The main issue with triggering push is that if you hit a problem, it's difficult to diagnose the issue. This is improving with time and wider browser support but it's far from easy. For this reason, I strongly recommend using a library to handle the encryption, formatting and triggering of your push message.

If you really want to learn about what the libraries do and look at each closer, we'll cover it in the next section. For now, we are going to look at how to manage subscriptions and use an existing web-push library to make the push requests.

In this section we'll be using the [ web-push for Node library](https://github.com/web-push-libs/web-push). Other languages will have differences, but they won't be too dissimilar. We are looking at Node since it's JavaScript and should be the most accessible for readers.

> **Remember**: If you want a library for a different language, checkout the [web-push-libs org on Github](https://github.com/web-push-libs/).

We'll go through the following steps:

1. Send a subscription to our backend and save it.
1. Retrieve saved subscriptions and trigger a push message.

## Saving Subscriptions

Saving and querying `PushSubscriptions` from a database will vary depending on
your server side language and database choice but it might be useful to see
an example of how it could be done.

In the demo web page the `PushSubscription` is sent to our backend by making a simple POST request:

<% include('../../demos/node-server/frontend/app.js', 'send-subscription-to-server') %>

The [Express](http://expressjs.com/) server in our demo has a matching request listener for `/api/save-subscription/` endpoint:

<% include('../../demos/node-server/index.js', 'save-sub-api-post') %>

In this route we validate the subscription, just to make sure the request is ok and not full of garbage:

<% include('../../demos/node-server/index.js', 'save-sub-api-validate') %>

> In this route we only check for an endpoint. If you **require** payload support, make sure you check for the auth and p256dh keys as well.

If the subscription is valid, we need to save it and return an appropriate
JSON response:

<% include('../../demos/node-server/index.js', 'save-sub-api-save-subscription') %>

This demo uses [nedb](https://github.com/louischatriot/nedb) to store the subscriptions, it's a simple file based database, but you could use any database you chose. We are only using this as it requires zero set-up. For production you'd want to use something more reliable (I tend to stick with good old MySQL).

<% include('../../demos/node-server/index.js', 'save-sub-function') %>

## Sending Push Messages

When it comes to sending a push message we ultimately need some event to trigger the process of sending a message to users. A common approach would be creating an admin page that let's you configure and trigger the push message. But you could create a program to run locally or any other approach that allows accessing the list of `PushSubscriptions` and running the code to trigger the push message.

Our demo has an "admin like" page that lets you trigger a push. Since it's just a demo it's a public page.

I'm going to go through each step involved in getting the demo working. These will be baby steps to everyone following along, including anyone who is new to Node.

When we discussed subscribing a user we covered adding an `applicationServerKey` to the `subscribe()` options. It's on the back end that we'll need the private key.

<% START_WF_EXCLUSION %>

> Remember you can use the web-push tool to generate application server keys or use web-push-codelab.appspot.com to generate some application server keys. See ["How to Create Application Server Keys"](/chapter-02/01-subscribing-a-user/#how-to-create-application-server-keys) for more details.

<% END_WF_EXCLUSION %>

In the demo these values are added to our Node app like so (boring code I know, but just want you to know there is no magic):

<% include('../../demos/node-server/index.js', 'vapid-keys') %>

Next we need to install the `web-push` module for our Node server:

    npm install web-push --save

Then in our Node script we require in the `web-push` module
like so:

<% include('../../demos/node-server/index.js', 'web-push-require') %>

Now we can start to use the `web-push` module. First we need to tell the web-push module about our application server keys (remember they are also known as VAPID keys because that's the name of the spec).

<% include('../../demos/node-server/index.js', 'web-push-vapid') %>

We also include a "mailto:" string as well. This string needs to be either a URL or a mailto email address. This piece of information will actually be sent to web push service as part of the request to trigger a push. The reason this is done is so that if a web push service needs to get in touch, they have some information that will enable them to.

With this, the `web-push` module is ready to use, the next step is to trigger a push message.

The demo uses the pretend admin panel to trigger push messages.

![Screenshot of the Admin Page.](/images/demo-admin-page.png)

Clicking the "Trigger Push Message" button will make a POST request to `/api/trigger-push-msg/` which is the signal for our backend to start send push messages, so we create the route in express for this endpoint:

<% include('../../demos/node-server/index.js', 'trig-push-api-post') %>

When this request is received, we grab the subscriptions from the database and
for each one, we trigger a push message.

<% include('../../demos/node-server/index.js', 'trig-push-send-push') %>

The function `triggerPushMsg()` can then use the web-push library to send a message to the provided subscription.

<% include('../../demos/node-server/index.js', 'trig-push-send-notification') %>

The call to `webpush.sendNotification()` will return a promise. If the message was sent successfully the promise will resolve and there is nothing we need to do. If the promise rejects, you need to examine the error as it'll inform you as to whether the PushSubscription is still valid or not.

To determine the type of error from a push service it's best to look at the status code. Error messages vary between push services and some are more helpful than others.

In this example it checks for status code '404' and '410', which are the HTTP status codes for 'Not Found' and 'Gone'. If we receive this status code, it means the subscription has expired or is no longer valid. In these scenarios we need remove the subscriptions from our database.

We'll cover some of the other status codes in the next section when we look at the web push protocol in more detail.

> If you hit problems at this stage, it's worth looking at the error logs from Firefox before Chrome. The Mozilla push service has much more helpful error messages compared to Chrome / FCM.

After looping through the subscriptions, we need to return a JSON response.

<% include('../../demos/node-server/index.js', 'trig-push-return-response') %>

We've gone over the major implementation steps.

1. Create an API to send subscriptions from our web page to our back-end so it can save them to a database.
1. Create an API to trigger the sending of push messages (in this case an API called from the pretend admin panel).
1. Retrieve all the subscriptions from our backend and send a message to each subscription with one of the [web-push libraries](https://github.com/web-push-libs/).

Regardless of your backend (Node, PHP, Python, ...) the steps for implementing push are going to be the same.

Next up, what exactly are these web-push libraries doing for us?

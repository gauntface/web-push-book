---
title: Sending Push Messages
---
# Sending Push Messages

With your backend recieving *PushSubscriptions* it's time to think about how
to send a push message to these users.

In this chapter we're going to look how we use a subscription to trigger a
push message with a network request and then see how the values used in
the request are made.

## The Network Request

Sending a push message is nothing more than an API call. You send a message
to a push service and that push service will make sure it gets to the end
user.

![Diagram of sending a push message from your server to a push service.](/images/png-version/server-to-push-service.png)

The format of the network request is known as the [Web Push Protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol). This
protocol is a standard that all push services must adhere to.

Let's look at what pieces of information we need add as headers to make a
Web Push Protocol request.

<table>
  <tr>
    <th>Endpoint</th>
    <td>This is the URL for the push service. This is always taken from
    PushSubscription you are wishing to send the message to (it's the endpoint
    value).</td>
  </tr>
  <tr>
    <th>Authorization</th>
    <td>This header is a JSON Web Token which is used by the push service
    to authenticate an application server, i.e. the application who is requesting
    this message be delivered is the same application who subscribed the
    user.</td>
  </tr>
  <tr>
    <th>Crypto-Key</th>
    <td>This value has one or two pieces. One piece is the `p256ecdsa` value
    which is the base64 url encoded *public application server key*, basically
    the same value as you'd pass into the *subscribe()* call. The second
    piece is `dh` which is the </td>
  </tr>
  <tr>
    <th>Encryption</th>
    <td>The encryption header is used to send the *salt* value that was
    used when encrypting your payload.</td>
  </tr>
  <tr>
    <th>Content-Type</th>
    <td>If you aren't sending a payload with your push message you can
    skip this value.

    If you do include a payload you'll want to set this to
    `application/octet-stream`. This lets the browser know that you intend to
    send a stream of bytes, which the push service will require.</td>
  </tr>
  <tr>
    <th>Content-Length</th>
    <td>This is the number of bytes you are going to send with your network
    request (i.e. the size of the payload).</td>
  </tr>
  <tr>
    <th>Content-Encoding</th>
    <td>
      This value should be `aesgcm` whenever you are sending a message with
      payload.
    </td>
  </tr>
  <tr>
    <th>TTL (Time to Live)</th>
    <td>
      Time to live is a required parameter that can be used to define how long
      a message should stay on the push service before it should be marked
      as expired (in seconds) after which the push service will not send the
      message. A TTL of 0 means the message should only be delivered if it can
      be delivered immediately.
    </td>
  </tr>
  <tr>
    <th>Topic</th>
    <td>
      The topic header allows you to group messages that you send to the push
      service such that the push service can replace any pending messages with
      the latest message. For example, we request a message be sent with
      'example-topic' and later on you send a second message with the same
      topic name, the push service will expire / drop the first message if
      it's still pending and only the second message will be sent. Sidenote:
      A topic must be less than or equal to 32 characters.
    </td>
  </tr>
  <tr>
    <th>Urgency</th>
    <td>
      **[Experimental]** Urgency allows you to determine if the message you're
      sending is vital or not on some scale, this can be used by the push
      service to conserve energy on the users device. You can send a value of
      "very-low" | "low" | "normal" | "high" and the default is "normal". At
      the time of writing (October 2016) I'm not sure what the support for this
      feature is like.
    </td>
  </tr>
</table>

We'll look into how to make all of the values in a minute, but first, what
gets returned when we make one of these requests?

The main thing to consider when you get a response is the status code.

<table>
  <tr>
    <th>Status Code</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>201</td>
    <td>Created. The request to send a push message was received and accepted.
    </td>
  </tr>
  <tr>
    <td>429</td>
    <td>Too many requests. Maining the application server has reached a rate
    limit with a push service. The push service include a 'Retry-After' header
    to indicate how long the before you can make another request.</td>
  </tr>
  <tr>
    <td>400</td>
    <td>Invalid request. This is generally means one of your headers is Invalid
    or poorly formed.</td>
  </tr>
  <tr>
    <td>400</td>
    <td>Invalid request.</td>
  </tr>
</table>

### Application Server Keys


### Encryption

When it comes to sending a push message it can be relatively simple if you use
a library, you can write the server side completely on your own which can be
OK if you are relatively happy with JSON Web Tokens and Encryption.

In this chapter we'll first look at using a Node.js library to send a message
and I'll highlight where you can find alternative libraries.

Then we'll look at the steps you can take if you want to do it yourself. This
might be of interest to you, or it might be somethng you want to skip. For what
it's worth, I'd say 90% of people will want to use a library.

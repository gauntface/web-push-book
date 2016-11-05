---
title: Sending Push Messages
---
# Sending Push Messages

With your backend receiving *PushSubscriptions* it's time to think about how
to send a push message to these users.

In this chapter we're going to look how we use a subscription to trigger a
push message with a network request and then see how the values are used in
that request.

## Preface

Before we get into the nitty-gritty of this, it's worth calling **one very
important piece of information**......ready??

**There are libraries that make this very easy**.

The [web-push-libs org on Github](https://github.com/web-push-libs/) is the
best place to go to find a library for your server side language. At the moment
there's
[Node.js](https://github.com/web-push-libs/web-push), [PHP](https://github.com/web-push-libs/web-push-php), [Java](https://github.com/web-push-libs/webpush-java) & [Python](https://github.com/web-push-libs/pywebpush).

Using one of these libraries will do all the heavy lifting that we'll outline
below. If you just want to use one of those libraries and want to skip the
details then please go straight to the next section, but if you're curious
what these libraries are actually doing, then read on.

*p.s. If you are working on a push library and / or find a library for a
language not yet supported, please let me know
[@gauntface](https://twitter.com/gauntface), would love to grow the org.*

## The Network Request

Sending a push message is nothing more than an API call. You send a message
to a push service and that push service will make sure it gets to the end
user.

![Diagram of sending a push message from your server to a push service.](/images/svgs/server-to-push-service.svg)

The format of the network request is known as the [Web Push Protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol). This
protocol is a standard that all push services must adhere to.

Let's look at what pieces of information we need add as headers to make a
Web Push Protocol request.

<table>
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
      service to conserve energy on the user's device. You can send a value of
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
    <td>Too many requests. Meaning the application server has reached a rate
    limit with a push service. The push service include a 'Retry-After' header
    to indicate how long the before you can make another request.</td>
  </tr>
  <tr>
    <td>400</td>
    <td>Invalid request. This is generally means one of your headers is Invalid
    or poorly formed.</td>
  </tr>
  <tr>
    <td>413</td>
    <td>Payload size too large. The minimum size payload a push service must
    support is <a href="https://tools.ietf.org/html/draft-ietf-webpush-protocol-10#section-7.2">4096 bytes</a> (or 4kb).</td>
  </tr>
</table>

### Generating the Headers

We've covered a long list of headers and now we're going to see what the
values each of them should be.

We'll split the headers up into groups to help follow what they are used for
by the push service + to help figure out where values come from.

#### Application Server Keys

This batch of headers are solely for helping the push service identify the
application server so it knows the request to send a message is coming from
the right place.

Previously we saw this diagram of how the private application server key (or
private VAPID key) is used to "Sign an Authorization header", that's what
we're going to look at now.

![Illustration of how the private application server key is used when sending a message.](/images/svgs/application-server-key-send.svg)

##### Authorization

The value we pass in as the *Authorization* header is a JSON web token.

A [JSON web token](https://jwt.io/) (or JWT for short) is basically a way
of sending a message to a third party in such a way that if they have your
public key, they can decrypt part of your JWT and validate that it's from you
because only you could sign it with your secret private key.

There are a host of libraries on [https://jwt.io/](https://jwt.io/) that can
doing the signing for you and I'd recommend you do that where you can.

###### How Does JWT Work?

A signed JWT is just a string, but if you look at it, you'll notice it can
be split into three strings joined by dots.

![A illustration of the strings in a JSON Web Token](/images/svgs/authorization-jwt-diagram-header.svg)

The first string is information about the JWT itself so anyone reading it can
tell it's a JWT and what algorithm was used to sign it.

For web push we take the JSON displayed below and encode it as a URL safe
base64 string.

```json
{  
  "typ": "JWT",  
  "alg": "ES256"  
}
```

The second string is the JWT Payload. This tells anyone reading the JWT a little
information about who sent it, who it's for and how long it's valid for.

For web push, the payload would look something like this:

```json
{  
  "aud": "https://some-push-service.org",
  "exp": "1469618703",
  "sub": "mailto:example@web-push-book.org"  
}
```

The 'aud' value is the "audience", i.e. who the JWT is for. For web push the
JWT is for the push service, so we set it to the **origin of the push service**.

The 'exp' value is the expiration of the JWT, this prevent snoopers from being
able to use your JWT easily. The expiration is a timestamp in milliseconds
and must be within 24 hours from the when the push service receives your message.

In Node.js we could safely set the expiration to
`Math.floor(Date.now() / 1000) + (12 * 60 * 60)`.

Finally, the 'sub' value needs to be either a URL or a "mailto" email address.
This is so that if a push service needed to reach out to it would be able to
reach you via the email address or contact information on the site.

Just like the first string, this JSON is encoded as a URL safe base64 string.

The third string, the signature, is an encrypted version of the first
two strings joined with a dot.

To phrase it differently, the first two strings (the JWT Info and JWT Payload)
are base64 encoded so they be decoded and viewed by anyone. We take these
two strings and join them with a dot character and we'll call this the
"unsigned token". The signature is the unsigned token encrypted with your
application servers private key. To make sure the message was from us, someone
would need to know our public key, decrypt the signature and make sure the
result is the same as the "unsigned token", meaning it must have been
from our private key and it hasn't been tampered with.

Final thing to top it off is the Authorization header needs 'WebPush' added to
the front.

    Authorization: 'WebPush <JWT Info>.<JWT Payload>.<Signature>

###### Crypto-Key

The 'Crypto-Key' header just needs the public application server key to be
added to it with 'p256ecdsa=' in front of (just so the push service knows its
a public key). The public key itself just needs to be URL safe base64 encoded,
i.e. the same value as you the *applicationServerKey* in the *subscribe()*
method.

    Crypto-Key: p256ecdsa=<URL Safe Base64 Public Application Server Key>

#### Payload

The above headers are to help with identifying the application server. This set
of headers focus on the payload, specifically how it's encrypted.

First question to answer is why the payload needs to be encrypted in the first
place. Since the browser determines the push service to use, you  the
developer can't ensure the security of the data you send, so encrypting it with
keys provided by the browser means the push service can't view the payload
of your message.

##### Encryption

The encryption header is the *salt* used when you encrypt the data, which
will be a base64 url safe encoded string from 16 random bytes.

    Encryption: salt=<URL Safe Base64 Salt>

##### Crypto-Key

The Crypto-Key value for encryption is a new public key used just for
encrypting the payload (the private key for this is used when encrypting
the payload, this means the push service can decrypt it with the public key
from this header).

    Crypto-Key: dh=<URL Safe Base64 Encoded String>

If you are using both application server keys (or VAPID) and encrypted payload
you should join them with a semi-colon, like so:

    Crypto-Key: dh=<URL Safe Base64 Encoded String>; p256ecdsa=<URL Safe Base64 Public Application Server Key>

##### Content-Type, Length & Encoding

The final headers are just to make sure the content is sent and received
correctly. The number of bytes of the payload and the other two are fixed
values.

    Content-Length: <Number of Bytes in Encrypted Payload>
    Content-Type: 'application/octet-stream'
    Content-Encoding: 'aesgcm'

#### Push Service Info

Phew. Application Server ID? Check. Encrypted Payload? Check. Now we just
need to cover of headers that affect how the push service manages your
push notifications.

##### TTL

This is a **required header**.

TTL (or time to live) should be an integer for the number of seconds you
want your push message to live on the push service before it's delivered. If
the TTL is expired that the message will be removed and it won't be delivered.

If you set a TTL of zero, the push service will attempt to deliver the message
immediately **but** if the device can't be reached, your message will be
removed from the push service.

Technically a push service can reduce the TTL for a push message if wants. You
can tell if this has happened by examining the TTL header in the response from
a push service.

##### Topic

This is an **optional header**.

Topics are strings that can be used to replace any pending notifications with
new notifications if they have matching topics.

This is useful in scenarios where the user's device might be offline while you've
sent three messages and you only want the user to receive one message when they
turn their device back on.

##### Urgency

This is an optional header.

This is optional and can be used to indicate to the push service how important
this message is to the user helping the push service help conserve battery
life on a users device.

Should a string value of "very-low" | "low" | "normal" | "high". The default
value is "normal".

### Everything Together

With all these headers added to a network request, the last thing to do is
to encrypt the payload and send the bytes to the push service.

Encrypting the payload is tough unless you understand encryption. If you want
to learn more then I'd strongly recommend reading [the spec here](https://tools.ietf.org/html/draft-ietf-webpush-encryption) or [this
blog post](https://developers.google.com/web/updates/2016/03/web-push-encryption).
Failing that, checkout [the web-push-libs org](https://github.com/web-push-libs)
and have a look through a projects code.

Once you have your encrypted payload, the headers above, you just need to send
the request the PushSubscriptions endpoint. Then you'll get that sweet 201
status code.

---
title: Sending Push Messages
---
# Sending Push Messages

With your backend receiving *PushSubscriptions* it's time to think about how
to send a push message to these users.

In this chapter we're going to look how we use a subscription to trigger a
push message.

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

Sending a push message is nothing more than making an API call to a Push
Service. When a Push Service receives this API call it'll queue your push
message and deliver it to the user as soon as it can.

![Diagram of sending a push message from your server to a push service.](/images/svgs/server-to-push-service.svg)

The format of the network request is known as the [Web Push Protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol). This
protocol is a standard that all push services must adhere to.

Let's look at what pieces of information we need add as headers to make a
Web Push Protocol request.

<table>
  <tr>
    <th>Authorization</th>
    <td>This header is a JSON Web Token which is used by the push service
    to authenticate an application server. In other words, the application who
    is making the request is the same application who subscribed the
    user.</td>
  </tr>
  <tr>
    <th>Crypto-Key</th>
    <td>This value has one or two pieces. One piece is the `p256ecdsa` value
    which is the base64 URL encoded *public application server key*, basically
    the same value as you'd pass into the *subscribe()* call. The second
    piece is `dh` which is the public encryption key used during encrypting
    the payload.</td>
  </tr>
  <tr>
    <th>Encryption</th>
    <td>The encryption header should be the *salt* value used when encrypting
    your payload.</td>
  </tr>
  <tr>
    <th>Content-Type</th>
    <td>This should be set to `application/octet-stream` when sending a
    payload. This lets the browser know that you intend to
    send a stream of bytes, which the Push Service will expect.</td>
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
      message. A TTL of 0 means the message should only be delivered **only**
      if it can be delivered immediately.
    </td>
  </tr>
  <tr>
    <th>Topic</th>
    <td>
      The topic header allows you to group messages that you send to the push
      service such that the push service can replace any pending messages with
      the newer push message. For example, we request a message be sent with
      a topic name 'example-topic'. Later on you send a second message with the same topic name. The push service will expire / drop the first message if
      it's still pending and only the second message will be sent. Side-note:
      A topic must be less than or equal to 32 characters.
    </td>
  </tr>
  <tr>
    <th>Urgency</th>
    <td>
      **[Experimental]** Urgency allows you to determine if the message you're
      sending is vital or not on some scale. This can be used by the push
      service to conserve energy on the user's device. You can send a value of
      "very-low" | "low" | "normal" | "high" and the default is "normal". At
      the time of writing (October 2016) I'm not sure what the support for this
      feature is like.
    </td>
  </tr>
</table>

### Generating the Headers

We've covered a long list of headers and now we're going to see what the
values each of them should be.

We'll split the headers up into the following groups:

1. Application Server Keys
2. Payload
3. Push Service Info

This will help us group what a header is used for..

#### Application Server Keys

This batch of headers help a push service identify the application server
making the request, this can then be used to check the application server is
allowed to message a user.

Previously we saw this diagram of how the private application server key (or
private VAPID key) is used to "Sign an Authorization header", that's what
we're going to look at now.

![Illustration of how the private application server key is used when sending a message.](/images/svgs/application-server-key-send.svg)

##### Authorization

The value we pass in as the *Authorization* header is a JSON Web Token.

A [JSON web token](https://jwt.io/) (or JWT for short) is basically a way
of sending a message to a third party such that if they have your
public key, they can decrypt part of a JWT and validate that it's from you
because only you could sign it with the matching private key.

There are a host of libraries on [https://jwt.io/](https://jwt.io/) that can
do the signing for you and I'd recommend you do that where you can. Here we'll
cover what signing a JWT does.

###### How Does JWT Work?

A signed JWT is just a string, but if you look at it, you'll notice it can
be split into three strings joined by dots.

![A illustration of the strings in a JSON Web Token](/images/svgs/authorization-jwt-diagram-header.svg)

The first string is information about the JWT itself so anyone reading it can
tell it's a JWT and what algorithm was used to sign it.

For web push the JWT info is the following JSON encoded as a URL safe
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
audience is the push service, so we set it to the **origin of the push
service**.

The 'exp' value is the expiration of the JWT, this prevent snoopers from being
able to re-use a JWT if they intercept it. The expiration is a timestamp in
seconds and must be no longer 24 hours.

In Node.js we could safely set the expiration to
`Math.floor(Date.now() / 1000) + (12 * 60 * 60)`.

Finally, the 'sub' value needs to be either a URL or a "mailto" email address.
This is so that if a push service needed to reach out to you, it would be able
to use the subject details to reach you via the email address or contact
information on the URL.

Just like the JWT Info, the JWT Payload's JSON is encoded as a URL safe base64
string.

The third string, the signature, is the result of taking the first two strings
(the JWT Info and JWT Payload) and joining them with a dot character, we'll
call this string the "unsigned token".

The signature is this "unsigned token" string encrypted with your
application servers private key.

To make sure the message was from us, someone with our public key can
decrypt the signature and make sure the result is the same as the "unsigned
token" (i.e. the first two strings in the signed JWT), meaning it must have
been from our private key and it hasn't been tampered with.

Final thing to top it off is the Authorization header needs 'WebPush' added to
the front.

    Authorization: 'WebPush <JWT Info>.<JWT Payload>.<Signature>

###### Crypto-Key

The 'Crypto-Key' header should be 'p256ecdsa=' followed your public application
server key, which needs to be URL safe base64 encoded.

This application server key must be the same key passed into `subscribe()` as
the `applicationServerKey` value.

    Crypto-Key: p256ecdsa=<URL Safe Base64 Public Application Server Key>

#### Payload

The above headers identify the application server. This next set
of headers focus on headers needed when sending a payload, and is heavily
linked to how a payload is encrypted.

You might be asking yourself, why does the payload need to be encrypted?

Since the browser determines the push service to use, you the
developer can't ensure the security of the data you send. Encrypting it with
keys provided by the browser means the push service can't view the payload
while the application server and browser and encrypt and decrypt
the message freely.

##### Encryption

The 'Encryption' header is the *salt* used when you encrypt the payload. The
salt is 16 random bytes used when encrypting the payload and
should be base64 URL safe encoded to be added in this head, like so:

    Encryption: salt=<URL Safe Base64 Salt>

##### Crypto-Key

We saw that the 'Crypto-Key' header is used under the 'Application Server Keys'
section to contain the public application server key.

Well, it's also used to share the public encryption key used to encrypt
the payload.

The resulting header looks like this:

    Crypto-Key: dh=<URL Safe Base64 Encoded String>; p256ecdsa=<URL Safe Base64 Public Application Server Key>

##### Content-Type, Length & Encoding

The final headers relating to encrypted payload make sure the content is sent
and received correctly. The 'Content-Length' header is number of bytes of the
encrypted payload and 'Content-Type' and 'Content-Encoding' headers are fixed
values.

    Content-Length: <Number of Bytes in Encrypted Payload>
    Content-Type: 'application/octet-stream'
    Content-Encoding: 'aesgcm'

#### Push Service Info

Phew. Application Server Headers? Check. Encrypted Payload Headers? Check.
Now we just need to cover Push Service headers.

##### TTL

This is a **required header**.

TTL (or time to live) should be an integer for the number of seconds you
want your push message to live on the push service before it's delivered. If
the TTL is expired that the message will be removed and it won't be delivered.

If you set a TTL of zero, the push service will attempt to deliver the message
immediately **but** if the device can't be reached, your message will be
removed from the push service.

Technically a push service can reduce the TTL for a push message if it wants.
You can tell if this has happened by examining the TTL header in the response
from a push service.

    TTL: <Time to live in seconds>

##### Topic

This is an **optional header**.

Topics are strings that can be used to replace any pending notifications with
new notifications if they have matching topic names.

This is useful in scenarios where the user's device might be offline during
which you might have sent three messages and you may want the user to receive
only the latest message when they turn their device back on.

##### Urgency

This is an **optional header**.

This can be used to indicate to the push service how important
a message is to the user. This could be used by the push service to
help conserve the battery life of a users device.

Should a string value of "very-low" | "low" | "normal" | "high". The default
value is "normal".

    Urgency: <very-low | low | normal | high>

### Everything Together

With all these headers added to a network request, the last thing to cover is
to actually encrypt the payload and send the payload bytes to the push service.

Encrypting the payload is tough unless you understand encryption.
If you *really* want to learn more then I'd strongly recommend reading
[the spec here](https://tools.ietf.org/html/draft-ietf-webpush-encryption) or
[this blog post](https://developers.google.com/web/updates/2016/03/web-push-encryption).

Failing that, checkout [the web-push-libs org](https://github.com/web-push-libs)
and have a look through one of the projects source code.

Once you have an encrypted payload, and the headers above, you just need to send
the request to the `endpoint` in a `PushSubscription`. You'll then get that
sweet 201 status code and your user will get your push message.

### Response from Push Service

Once you've made a request to a Push Service, you need to check the status code
of the response as that'll inform you as to whether the request was successful
or not.

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
    <td>Too many requests. Meaning your application server has reached a rate
    limit with a push service. The push service should include a 'Retry-After'
    header to indicate how long before another request can be made.</td>
  </tr>
  <tr>
    <td>400</td>
    <td>Invalid request. This generally means one of your headers is invalid
    or poorly formed.</td>
  </tr>
  <tr>
    <td>413</td>
    <td>Payload size too large. The minimum size payload a push service must
    support is <a href="https://tools.ietf.org/html/draft-ietf-webpush-protocol-10#section-7.2">4096 bytes</a> (or 4kb).</td>
  </tr>
</table>

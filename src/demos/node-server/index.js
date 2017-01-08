/**** START web-push-require ****/
const webpush = require('web-push');
/**** END web-push-require ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');

/**** START web-push-gcm ****/
const gcmServerKey = 'AIzaSyC5itnz9jHmpvQRhq8sJUCFUy2SYUPanGs';
webpush.setGCMAPIKey(gcmServerKey);
/**** END web-push-gcm ****/

/**** START web-push-vapid ****/
/**** START vapid-keys ****/
const vapidKeys = {
  publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
  privateKey: 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls'
};
/**** END vapid-keys ****/

webpush.setVapidDetails(
  'mailto:web-push-book@gauntface.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
/**** END web-push-vapid ****/

const db = new Datastore({
  filename: path.join(__dirname, 'subscription-store.db'),
  autoload: true
});

/**** START save-sub-function ****/
function saveSubscriptionToDatabase(subscription) {
  return new Promise(function(resolve, reject) {
    db.insert(subscription, function(err, newDoc) {
      if (err) {
        reject(err);
        return;
      }

      resolve(newDoc._id);
    });
  });
};
/**** END save-sub-function ****/

function getSubscriptionsFromDatabase() {
  return new Promise(function(resolve, reject) {
    db.find({}, function(err, docs) {
      if (err) {
        reject(err);
        return;
      }

      resolve(docs);
    })
  });
}

function deleteSubscriptionFromDatabase(subscriptionId) {
  return new Promise(function(resolve, reject) {
  db.remove({_id: subscriptionId }, {}, function(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

const app = express();
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(bodyParser.text());

// This is the API that receives a push subscription and saves it.
/**** START save-sub-api-post ****/
app.post('/api/save-subscription/', function (req, res) {
/**** END save-sub-api-post ****/
  /**** START save-sub-api-validate ****/
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
    return;
  }
  /**** END save-sub-api-validate ****/

  /**** START save-sub-api-save-subscription ****/
  return saveSubscriptionToDatabase(req.body)
  .then(function(subscriptionId) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { success: true, id: subscriptionId } }));
  })
  .catch(function(err) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'unable-to-save-subscription',
        message: 'The subscription was received but we were unable to save it to our database.'
      }
    }));
  });
  /**** END save-sub-api-save-subscription ****/
});

app.post('/api/get-subscriptions/', function (req, res) {
  // TODO: This should be secured / not available publicly.
  //       this is for demo purposes only.

  return getSubscriptionsFromDatabase()
  .then(function(subscriptions) {
    const reducedSubscriptions = subscriptions.map((subscription) => {
      return {
        id: subscription._id,
        endpoint: subscription.endpoint
      }
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { subscriptions: reducedSubscriptions } }));
  })
  .catch(function(err) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'unable-to-get-subscriptions',
        message: 'We were unable to get the subscriptions from our database.'
      }
    }));
  });
});

/**** START trig-push-api-post ****/
app.post('/api/trigger-push-msg/', function (req, res) {
/**** END trig-push-api-post ****/
  // NOTE: This API endpoint should be secure (i.e. protected with a login
  // check OR not publicly available.)

  /**** START trig-push-send-push ****/
  return getSubscriptionsFromDatabase()
  .then(function(subscriptions) {
    const sendPromises = subscriptions.map(function(subscription) {
      /**** START trig-push-send-notification ****/
      return webpush.sendNotification(subscription, JSON.stringify(req.body))
      .catch((err) => {
        if (err.statusCode === 410) {
          return deleteSubscriptionFromDatabase(subscription._id);
        } else {
          console.log('Subscription is no longer valid: ', err);
        }
      });
      /**** END trig-push-send-notification ****/
    });

    return Promise.all(sendPromises);
  })
  /**** END trig-push-send-push ****/
  /**** START trig-push-return-response ****/
  .then(() => {
    res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ data: { success: true } }));
  })
  .catch(function(err) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'unable-to-get-subscriptions',
        message: 'We were unable to get the subscriptions from our database.'
      }
    }));
  });
  /**** END trig-push-return-response ****/
});

const server = app.listen(9012, function () {
  console.log('Running on http://localhost:' + server.address().port);
});

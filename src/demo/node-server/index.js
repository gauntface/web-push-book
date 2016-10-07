/**** START web-push-require ****/
const webpush = require('web-push');
/**** END web-push-require ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');

const db = new Datastore({
  filename: path.join(__dirname, 'subscription-store.db'),
  autoload: true
});

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

const app = express();
app.use(express.static(path.join(__dirname, '..', 'web-app')));
app.use(bodyParser.json());

/**** START save-sub-api ****/
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

// This is the API that receives a push subscription and saves it.
/**** START save-sub-api-post ****/
app.post('/api/save-subscription/', function (req, res) {
/**** END save-sub-api-post ****/
  // Check the body has an subscription with at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription - return error.
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
});
/**** END save-sub-api ****/

app.all('/api/get-subscriptions/', function (req, res) {
  // TODO: This should be secured / not available publicly.
  //       this is for demo purposes only.

  return getSubscriptionsFromDatabase()
  .then(function(subscriptions) {
    if (req.method === 'GET') {
      console.log(subscriptions);
      const tableHeading = '<tr><th>ID</th><th>Endpoint</th><th>p256dh Key</th><th>Auth Secret</th></tr>';
      let tableContent = '';
      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        tableContent += '<tr>\n';
        tableContent += '<td>' + subscription._id + '</td>\n';
        tableContent += '<td>' + subscription.endpoint + '</td>\n';

        if (subscription.keys && subscription.keys.p256dh) {
          tableContent += '<td>' + subscription.keys.p256dh + '</td>\n';
        } else {
          tableContent += '<td>No Key</td>\n';
        }

        if (subscription.keys && subscription.keys.auth) {
          tableContent += '<td>' + subscription.keys.auth + '</td>\n';
        } else {
          tableContent += '<td>No Auth</td>\n';
        }

        tableContent += '</tr>\n\n';
      }
      res.send('<table>' + tableHeading + tableContent + '</table>');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ data: { subscriptions: subscriptions } }));
    }
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

/**
 *
 *
 */

app.all('/api/get-subscriptions/', function (req, res) {
  // TODO: This endpoint should be secured, restricting access

  /**** START web-push-gcm ****/
  const gcmServerKey = 'AIzaSyC5itnz9jHmpvQRhq8sJUCFUy2SYUPanGs';
  webpush.setGCMAPIKey(gcmServerKey);
  /**** END web-push-gcm ****/

  /**** START web-push-vapid ****/
  const vapidKeys = {
    publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
    privateKey: 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls'
  };

  webpush.setVapidDetails(
    'mailto:web-push-book@gaunt.io',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  /**** END web-push-vapid ****/
});

const server = app.listen(9012, function () {
  console.log('Running on http://localhost:' + server.address().port);
});

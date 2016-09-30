const path = require('path');
const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');

const vapidKeys = {
  public: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
  private: 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls'
};

const db = new Datastore({
  filename: path.join(__dirname, 'subscription-store.db'),
  autoload: true
});

function saveSubscriptionToDatabase(subscription) {
  // TODO: Save to database
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

const app = express();
app.use(express.static(path.join(__dirname, '..', 'web-app')));
app.use(bodyParser.json());

// This is the API that receives a push subscription and saves it
app.post('/api/save-subscription/', function (req, res) {
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription - return error
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

const server = app.listen(9012, function () {
  console.log('Running on http://localhost:' + server.address().port);
});
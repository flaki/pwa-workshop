'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8888;


const app = express();

app.use(express.static(path.join(__dirname,'www')));
app.use(bodyParser.json());

// ...

let data = require('./data.json');

app.use('/api/todos', function(req, res) {
  if (req.method === 'GET') {
    return res.json(data);
  }

  let id = req.body.id, done = req.body.done;
  data.forEach(r => {
    if (~id.indexOf(r.id)) r.done = done;
  });

  return res.json({ done: true, err: null });
});


// Push notifications facing API parts
let webPush = require('web-push');
webPush.setGCMAPIKey('AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU');

app.use("/api/push/register", function(req, res, next) {
  let endpoint = req.body.endpoint;

  if (endpoint) {
    console.log('Endpoint subscribed to Push Notifications: ', endpoint);

    // Send a push notification
    setTimeout(function() {
      console.log('Sending Push to', endpoint);
      webPush.sendNotification(endpoint);
    }, 5000);

    return res.json({ done: true, err: null });
  }

  console.error('Subscription error! ', req.body);
});



app.listen(PORT, 'localhost', function() {
  console.log('Server started on localhost:', PORT);
});

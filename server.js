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

app.listen(PORT, 'localhost', function() {
  console.log('Server started on localhost:', PORT);
});

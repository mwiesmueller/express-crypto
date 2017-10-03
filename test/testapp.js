'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const log = require('morgan');
const methodOverride = require('method-override');
const http = require('http');

// Create Webserver
const app = express();
const server = http.createServer(app);

// Import module

const crypto = require('../lib');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(log('dev'));
app.use(methodOverride());
app.use(crypto({ secret: 'secret123', debug: true }, app));

app.post('/test', (req, res) => {
  if (req.body.foo === 'not encrypted') {
    return res.status(201).send({ foo: 'bar' });
  }

  res.status(200).send({ hello: 'world' });
});

server.listen(8090, (err) => {
  if (err) {
    throw new Error('Error on Server-startup: ' + err);
  }
});

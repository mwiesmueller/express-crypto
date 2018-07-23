'use strict';

const bodyParser = require('body-parser');
const mung = require('express-mung');
const crypt = require('./crypt');

const debug = require('./debug');

const expressCrypto = (options, app) => {
  if (!options || !options.secret) {
    throw new Error('Error: Function is called without or not complete options');
  }

  if (!app) {
    throw new Error('Error: You must define the express function (app) to run this module!');
  }

  app.use(bodyParser.raw({
      type: 'application/text',
      limit: options.limit || '10mb'
  }));

  app.use(bodyParser.json({
      type: 'application/json',
      limit: options.limit || '10mb'
  }));

  app.use(bodyParser.text({
      type: 'application/text',
      limit: options.limit || '10mb'
  }));

  app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/text' && req.headers['content-encrypted'].toLowerCase() === 'aes') {
      debug(options.debug, 'Receive a encrypted Content: ' + req.body.toString());

      let body;

      try {
        body = JSON.parse(crypt.decrypt(req.body.toString(), options.secret));

        debug(options.debug, 'Transform to object: ' + JSON.stringify(body));
      } catch (err) {
        debug(options.debug, 'Error: ' + err);

        body = {};
      }

      req.body = body;

      return next();
    }

    // Set Warning
    res.setHeader('Warning', options.warningheader || 'This service supports an encrypted content in all rest calls. Please contact us for maximum of security!');
    debug(options.debug, 'Receive a not encrypted content');

    next();
  });

  return mung.json((responseBody, req) => {
    if (req.headers['content-type'] === 'application/text' && req.headers['content-encrypted'].toLowerCase() === 'aes') {
      debug(options.debug, 'Response a encrypted content: ' + JSON.stringify(responseBody));

      const ciphertext = crypt.encrypt(JSON.stringify(responseBody), options.secret);

      debug(options.debug, 'Encrypt content: ' + ciphertext);

      return ciphertext;
    }

    return responseBody;
  });
};

module.exports = expressCrypto;

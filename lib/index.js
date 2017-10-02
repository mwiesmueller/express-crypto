'use strict';

const bodyParser = require('body-parser');
const mung = require('express-mung');
const CryptoJS = require('crypto-js');

const expressCrypto = (options, app) => {
  if (!options || !options.secret) {
    throw new Error('Error: Function is called without or not complete options');
  }

  if (!app) {
    throw new Error('Error: You must define the express function (app) to run this module!');
  }

  app.use(bodyParser.raw({
      type: 'application/octet-stream',
      limit: options.limit || '10mb'
  }));

  app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/octet-stream' && req.headers['content-encrypted'].toLowerCase() === 'aes') {
      const bytes = CryptoJS.AES.decrypt(req.body.toString(), options.secret);
      let body;

      try {
        body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (err) {
        body = {};
      }

      req.body = body;

      return next();
    }

    // Set Warning
    res.setHeader('Warning', options.warningheader || 'This service supports an encrypted content in all rest calls. Please contact us for maximum of security!');

    next();
  });

  return mung.json((responseBody, req) => {
    if (req.headers['content-type'] === 'application/octet-stream' && req.headers['content-encrypted'].toLowerCase() === 'aes') {
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(responseBody), options.secret).toString();
      const data = ciphertext.toString();

      return data;
    }

    return responseBody;
  });
};

module.exports = expressCrypto;

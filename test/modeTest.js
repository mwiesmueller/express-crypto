'use strict';

const assert = require('assertthat');
const request = require('request');
const CryptoJS = require('crypto-js');

const crypto = require('../lib');

describe('crypto....', () => {
  it('... is of type function', (done) => {
    assert.that(crypto).is.ofType('function');
    done();
  });

  it('... throws an error when options are not defined', (done) => {
    assert.that(() => {
      crypto();
    }).is.throwing('Error: Function is called without or not complete options');
    done();
  });

  it('... throws an error when options are not complete', (done) => {
    assert.that(() => {
      crypto({});
    }).is.throwing('Error: Function is called without or not complete options');
    done();
  });

  it('... throws an error when app are not defined', (done) => {
    assert.that(() => {
      crypto({ secret: 'secret123' });
    }).is.throwing('Error: You must define the express function (app) to run this module!');
    done();
  });
});

describe('... Test module in Express', () => {
  before('... start Express Service', (done) => {
    require('./testapp');

    done();
  });

  it('... request a warning header when content is not encrypted', (done) => {
    request({ url: 'http://127.0.0.1:8090/test', method: 'POST', json: true, body: { foo: 'not encrypted' }}, (err, res) => {
      if (err) {
        throw err;
      }

      assert.that(res.headers.warning).is.equalTo('This service supports an encrypted content in all rest calls. Please contact us for maximum of security!');
      done();
    });
  });

  it('... request a encrypted content when the header are changed to encrypted', (done) => {
    request({ url: 'http://127.0.0.1:8090/test', method: 'POST', json: true, headers: { 'content-type': 'application/text', 'content-encrypted': 'aes' }, body: 'U2FsdGVkX1+9nwrZMT8J4FaqSO8uBnZXUCGqHJqQpDm6+wldX9gxgy9jBtTR/9dS' }, (err, res) => {
      if (err) {
        throw err;
      }

      const bytes = CryptoJS.AES.decrypt(res.body.toString(), 'secret123');
      const body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      assert.that(res.headers.warning).is.undefined();
      assert.that(body).is.equalTo({ hello: 'world' });
      done();
    });
  });
});

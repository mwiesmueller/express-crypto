'use strict';

const assert = require('assertthat');
const request = require('request');
const crypt = require('../lib/crypt');

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
    request({ url: 'http://127.0.0.1:8090/test', method: 'POST', json: true, headers: { 'content-type': 'application/text', 'content-encrypted': 'aes' }, body: 'mF4ndiwq9K0q924GRFXa3sn1zBOjXLM5wOUB2sAO0V2l6nf2qd2qTUsLqbCvKs7sUMvyFD8rbbjPCLXHWyTwaBRdlTDFXZNi+tGHGEA1Xk8=' }, (err, res) => {
      if (err) {
        throw err;
      }

      const body = JSON.parse(crypt.decrypt(res.body, 'secret123'));

      assert.that(res.headers.warning).is.undefined();
      assert.that(body).is.equalTo({ hello: 'world' });
      done();
    });
  });
});

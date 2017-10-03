'use strict';

const debug = (active, text) => {
  if (active) {
    console.log('[EXPRESS-Crypto DEBUG] : ' + text);
  }
};

module.exports = debug;

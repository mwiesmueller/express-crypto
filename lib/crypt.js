'use strict';

const CryptoJS = require('crypto-js');
const atob = require('atob');
const btoa = require('btoa');

const keySize = 256;
const ivSize = 128;
const saltSize = 256;
const iterations = 1000;

/* eslint-disable */
const wrapper = {
  encrypt: (msg, pass) => {
    const salt = CryptoJS.lib.WordArray.random(saltSize / 8);
    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations
    });

    const iv = CryptoJS.lib.WordArray.random(ivSize / 8);
    const encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    const encryptedHex = wrapper.base64ToHex(encrypted.toString());
    const base64result = wrapper.hexToBase64(salt + iv + encryptedHex);

    return base64result;
  },

  decrypt: (transitmessage, pass) => {
    const hexResult = wrapper.base64ToHex(transitmessage)

    const salt = CryptoJS.enc.Hex.parse(hexResult.substr(0, 64));
    const iv = CryptoJS.enc.Hex.parse(hexResult.substr(64, 32));
    const encrypted = wrapper.hexToBase64(hexResult.substring(96));

    const key = CryptoJS.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations
      });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  },

  hexToBase64: (str) =>{
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
  },

  base64ToHex: (str) => {
    for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
      let tmp = bin.charCodeAt(i).toString(16);
      
      if (tmp.length === 1) tmp = "0" + tmp;
      hex[hex.length] = tmp;
    }

    return hex.join("");
  }
};

module.exports = wrapper;

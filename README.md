# express-crypto

This module allows you to encrypt the data transmitted via REST API in use with [node-express](https://www.npmjs.com/package/express).

## Installation

To install the module run:

```
npm i --save --save-exact express-crypto
```

## Implementate as middleware module

You can implementate this module as middleware module in express:

```
.
.
.
.
const express = require('express');
const app = express();
const crypto = require('express-crypto');

.
.

app.use(crypto({ secret: 'secret123' }, app));
.
.
```

## Reference

##### crypto([options], fn)

In the first propertie it's necessary to define the configuration for `express-crypto`. The second propertie must define as the express function where's defined as `app` in my example.

##### options as object

- secret: Define the Secret for the encryption.
- warningheader: Define a warningheader for the response when the request is not encrypted. Set it to false do deactivate. Default is `This service supports an encrypted content in all rest calls. Please contact us for maximum of security!`
- limit: Define the content limit. Default is `10mb`
- debug: Set it to true when you like debug information in console


## Call an encrypted REST calls

This middleware module validate the `content-type` and the additional `content-encrypted` header in the request. If the `content-type` equal `application/text` and the `content-encrypted` equal `aes` this module expect an encrypted content. So the module will decrypt the content from request and encrypt the response with the defined secret.

The big advantage of this module is the definition in the middleware of `express`. So you can work with your decrypted Objects in all the routes of the API.

## License

The MIT License (MIT)
Copyright (c) 2017 Martin Wiesmüller - WERBAS AG / Werbas Innotec GmbH.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

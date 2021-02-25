# webtotp

[![npm (scoped)](https://img.shields.io/badge/npm-2.0.0-green)](https://www.npmjs.com/package/webtotp)

Generate and validate current/last token

## Install

`$ npm install webtotp`

### Usage

1. Ask a user to setup OTP.
2. They set a date (past or future) of their choosing and a secret (whatever they want, this shouldn't be a password but it should remain secret), that they need to remember. These are then stored encrypted on the server.
3. Either create a frontend TOTP generator near the login screen (or on a seperate step) that users can enter token date and secret OR use a public facing one (https://depperm.github.io/ - there are dangers/risks with 3rd party sites, the main one being potential logging of input).
4. Then on the server you can validate the TOTP based on a generated token from the decrypted date and secret.

```
import {webtotp, validate} from 'webtotp'
//const webtotp = require('webtotp')

/*
* parameters:
* tokenDate {Date} - users token date
* secret {string} - users token secret
* tokenTime {number} - how long each token last, default 30
* hashType {string} - node crypto algorithm type, default sha1
* tokenLength {number} - how long of a token do you want, default 6
* 
* return { token:string, timeUntilChange:number(between 0-1)}
*/
let gen = webtotp(tokenDate, secret, tokenTime, hashType, tokenLength)
//let gen = webtotp.webtotp(....)

let isValid = validate(userInputToken, tokenDate, secret, tokenTime, hashType, tokenLength)
//let isValid = webtotp.validate(...)
```


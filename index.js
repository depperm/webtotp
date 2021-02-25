import crypto from 'crypto'

/**
* Generate a OTP give a date to go off of.
* Heavily referenced: https://tools.ietf.org/html/rfc6238
*
* @param {Date} tokenDate - The date to base token off of
* @param {string} tokenSecret - The secret used to generate the token off of
* @param {number} tokenTime - Time period of each token before changing
* @param {string} hashType - The hmac hash type, possiblities are ['SHA1','SHA256','SHA512']
* @param {number} tokenLength - How long of a token you want back, should be greater than or equal to 0
* 
* @return {Object} An object containing the token {string} and timeUntilChange {number}(between 0-1)
*/
const webtotp = (tokenDate, tokenSecret='', tokenTime=30, hashType='SHA1', tokenLength=6)=>{
	let result = { timeUntilChange: 0, token: '' };

	let interval = tokenTime * 1000;// in seconds

	let diff;
	if ((new Date()).getTime() > tokenDate.getTime()) {
		diff = ((new Date()).getTime() - tokenDate.getTime()) / interval
	  result.timeUntilChange = Math.abs(diff) % 1;
	} else {
		diff = (tokenDate.getTime() - (new Date()).getTime()) / interval
	  result.timeUntilChange =  1- (Math.abs(diff) % 1);
	}

	let hash = crypto.createHmac(hashType, Buffer.from(tokenSecret).toString('hex')).update((Math.abs(Math.floor(diff))).toString()).digest('hex')

	// hash to byte array
	let byteArray = [];
	for (var i = 0; i < hash.length; i += 2) {
	  byteArray.push(parseInt(hash.substr(i, 2), 16));
	}
	let offset = byteArray[byteArray.length-1] & 0xf;

	let binary = ((byteArray[offset] & 0x7f) << 24) |
	      ((byteArray[offset + 1] & 0xff) << 16) |
	      ((byteArray[offset + 2] & 0xff) << 8) |
	      (byteArray[offset + 3] & 0xff);
	  
	let otp = binary % Math.pow(10, tokenLength)
	result.token = otp.toString().padStart(tokenLength, '0')

  return result
}
/*
* @param {string} tokenToMatch - User entered TOTP token
* All the rest of the params are the same as webtotp
*
* @return {boolean} Does the generated token match current or previous
*/
const validate = (tokenToMatch, tokenDate, tokenSecret='', tokenTime=30, hashType='SHA1', tokenLength=6)=>{
	let tokenA = webtotp(tokenDate, tokenSecret, tokenTime, hashType, tokenLength)
	let tokenB = webtotp(new Date(tokenDate.getTime() + (tokenTime * 1000)), tokenSecret, tokenTime, hashType, tokenLength)

	return tokenA.token === tokenToMatch || tokenB.token === tokenToMatch
}

export { webtotp, validate }

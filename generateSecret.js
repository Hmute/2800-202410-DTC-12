const crypto = require('crypto');

// Generate a random string
const secret = crypto.randomBytes(20).toString('hex');

console.log(secret);

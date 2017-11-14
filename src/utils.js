const crypto = require('crypto');

const generateStateToken = length => crypto.randomBytes(length || 20).toString('hex');

module.exports = {
  generateStateToken,
};

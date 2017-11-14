const request = require('request-promise-native');
const config = require('config');
const utils = require('../../utils');

const {
  baseUrl, accessTokenUrl, consumerKey, consumerSecret,
} = config.get('nest.oauth');

const saveStateToken = async token => !!token; // TODO save it

const verifyStateToken = async token => !!token; // TODO verify it

const buildOAuthUrl = () => {
  const stateToken = utils.generateStateToken(12);
  saveStateToken(stateToken);
  return `${baseUrl}?client_id=${consumerKey}&state=${stateToken}`;
};

const getAccessToken = async code => request({
  method: 'POST',
  uri: accessTokenUrl,
  json: true,
  form: {
    client_id: consumerKey,
    client_secret: consumerSecret,
    code,
    grant_type: 'authorization_code',
  },
}).catch((err) => {
  console.log('error', err.error);
  return err.error;
});

module.exports = {
  buildOAuthUrl,
  verifyStateToken,
  getAccessToken,
};

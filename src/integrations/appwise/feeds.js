import request from 'request-promise-native';
import config from 'config';

const submitEvent = async (payload) => {
  return request({
    method: 'POST',
    uri: config.get('feeds.url'),
    json: true,
    body: payload,
    oauth: {
      consumer_key: config.get('feeds.oauth.consumerKey'),
      consumer_secret: config.get('feeds.oauth.consumerSecret'),
    },
  }).then((result) => {
    console.log('done', result);
  }).catch((err) => {
    console.log('error', err.error);
    return err.error;
  });
};


module.exports = {
  submitEvent,
};

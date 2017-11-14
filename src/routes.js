import express from 'express';
import config from 'config';
import appdirect from './appdirect';
import nest from './integrations/nest';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  return res.json({ hello: 'world' });
});

router.get('/integrations/appdirect', (req, res) => {
  appdirect.handleIntegrationEvent(req);
  return res.status(200).json({});
});

router.get('/auth/nest', (req, res, next) => {
  const redirectUrl = nest.buildOAuthUrl();
  console.log(`Redirecting to ${redirectUrl}...`);
  return res.redirect(redirectUrl);
});

// Redirect from Nest OAuth
router.get('/oauth/nest', async (req, res) => {
  const { state, code } = req.query;

  // Ensure that state token is valid
  if (!nest.verifyStateToken(state)) {
    return res.status(401).json({ error: 'Invalid state token' });
  }

  const accessCodeObject = await nest.getAccessToken(code);
  if (accessCodeObject && accessCodeObject.access_token) {
    const { access_token, expires_in } = accessCodeObject;
    // nest.startStreaming(access_token);
    const stream = new nest.NestStream(access_token);
    res.redirect('/nest/connected');
  } else {
    return res.json(accessCodeObject);
  }
});

router.get('/nest/connected', (req, res) => {
  return res.render('device-connected', {
    title: 'Nest Feeds',
    nestSerial: config.get('nest.serial'),
  });
});

module.exports = router;

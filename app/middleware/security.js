/**
 * @fileoverview Security middeware
 */

//Imports
const config = require('config');
const cors = require('cors');
const helmet = require('helmet');
const router = require('express').Router();

//CORS
router.use(cors({
  origin: `https://${config.get('core.server.domain')}`
}));

//Helmet
router.use(helmet());

router.use(helmet.hsts({
  maxAge: 5184000,
  includeSubDomains: false
}));

router.use(helmet.contentSecurityPolicy({
  directives: {
    connectSrc: ['\'self\''],
    defaultSrc: ['\'self\''],
    styleSrc: ['\'self\'', '\'unsafe-inline\''],
    workerSrc: ['\'self\'', '\'unsafe-inline\''],
    fontSrc: ['\'self\'', 'data:'],
    scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'storage.googleapis.com']
  }
}));

router.use(helmet.permittedCrossDomainPolicies());

router.use(helmet.expectCt({
  enforce: true
}));

router.use(helmet.referrerPolicy({
  policy: 'no-referrer'
}));

//Export
module.exports = router;
/**
 * @fileoverview Security middeware
 */

//Imports
const cors = require('cors');
const {domain} = require('../../config.js').core;
const helmet = require('helmet');
const router = require('express').Router();

//CORS
router.use(cors({
  origin: `https://${domain}`
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
    scriptSrc: ['\'self\'', '\'unsafe-inline\'']
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
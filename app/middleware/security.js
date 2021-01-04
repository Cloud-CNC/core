/**
 * @fileoverview Security middeware
 */

//Imports
const config = require('config');
const cors = require('cors');
const helmet = require('helmet');

//Exports
module.exports = [
  //CORS
  cors({
    credentials: true,
    origin: config.get('core.server.cors')
  }),

  //Helmet
  helmet(),

  helmet.hsts({
    maxAge: config.get('core.cryptography.hsts'),
    includeSubDomains: false
  }),

  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: ['\'self\''],
      defaultSrc: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\''],
      workerSrc: ['\'self\'', '\'unsafe-inline\''],
      fontSrc: ['\'self\'', 'data:'],
      scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'storage.googleapis.com']
    }
  }),

  helmet.permittedCrossDomainPolicies(),

  helmet.expectCt({
    enforce: true,
    maxAge: config.get('core.cryptography.ct')
  }),

  helmet.referrerPolicy({
    policy: 'no-referrer'
  })
];
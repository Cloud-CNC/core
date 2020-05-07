/**
 * @fileoverview Middleware
 */

//Imports
const config = require('config');
const json = require('express').json;
const limit = require('./limit.js');
const logger = require('./logger.js');
const router = require('express').Router();
const sanitizer = require('express-sanitizer');
const security = require('./security.js');
const session = require('./session.js');

//Middleware
router.use(logger);
router.use(sanitizer());
router.use(json({
  limit: config.get('core.server.uploadLimit')
}));
router.use(security);
if (process.env.NODE_ENV != 'development')
{
  router.use('/api', limit);
}
router.use('/api', session);

//Export
module.exports = router;
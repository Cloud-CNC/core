/**
 * @fileoverview Rate Limit Middleware
 */

//Imports
const config = require('config');
const rateLimit = require('express-rate-limit');
const rateLimitMongo = require('rate-limit-mongo');
const router = require('express').Router();

//Middleware
router.use(rateLimit({
  windowMs: config.get('core.server.rateLimitWindow'),
  max: config.get('core.server.rateLimitRequests'),
  message: {
    error: {
      name: 'Rate Limit',
      description: 'You\'ve hit a rate limit, please wait before trying again!'
    }
  },
  store: new rateLimitMongo({
    collectionName: 'limits',
    uri: config.get('core.data.database')
  })
}));

//Export
module.exports = router;
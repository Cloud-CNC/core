/**
 * @fileoverview Rate Limit Middleware
 */

//Imports
const rateLimit = require('express-rate-limit');
const rateLimitMongo = require('rate-limit-mongo');
const router = require('express').Router();
const {core, data} = require('../../config.js');

//Middleware
router.use(rateLimit({
  windowMs: core.rateLimitWindow,
  max: core.rateLimitRequests,
  message: {
    error: {
      name: 'Rate Limit',
      description: 'You\'ve hit a rate limit, please wait before trying again!'
    }
  },
  store: new rateLimitMongo({
    collectionName: 'limits',
    uri: data.database
  })
}));

//Export
module.exports = router;
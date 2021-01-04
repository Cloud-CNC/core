/**
 * @fileoverview Rate Limit Middleware
 */

//Imports
const config = require('config');
const rateLimit = require('express-rate-limit');
const rateLimitRedis = require('rate-limit-redis');
const redis = require('../lib/redis').client;

//Export
module.exports = rateLimit({
  windowMs: config.get('core.server.rateLimitWindow'),
  max: config.get('core.server.rateLimitRequests'),
  message: {
    error: {
      name: 'Rate Limit',
      description: `You've hit a rate limit, please wait ${config.get('core.server.rateLimitWindow')/(1000 * 60)} minutes before trying again!`
    }
  },
  store: new rateLimitRedis({
    client: redis,
    prefix: 'limits#'
  })
});
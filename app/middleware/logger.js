/**
 * @fileoverview Logger middleware
 */

//Imports
const logger = require('../lib/logger.js');

module.exports = (req, res, next) =>
{
  logger.info(`New request, method: ${req.method} Endpoint: ${req.path} IP: ${req.ip}`);
  next();
};
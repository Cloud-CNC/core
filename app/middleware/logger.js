/**
 * @fileoverview Logger middleware
 */

//Imports
const logger = require('../lib/logger.js');

module.exports = (req, _, next) =>
{
  logger.info(`New HTTP request, method: ${req.method}, endpoint: ${req.path}, IP: ${req.ip}`);
  next();
};
/**
 * @fileoverview 404 route
 */

//Imports
const logger = require('../lib/logger.js');
const router = require('express').Router();

//Route
router.use((req, res, next) =>
{
  logger.warn(`Received request for invalid endpoint: ${req.baseUrl}`);
  
  res.status(404);
  return res.json({
    error: {
      name: 'Error 404',
      description: 'The requested endpoint is invalid! If this persists, please contact your administrator.'
    }
  });
});

//Export
module.exports = router;
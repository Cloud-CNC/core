/**
 * @fileoverview Error route
 */

//Imports
const logger = require('../lib/logger.js');
const router = require('express').Router();

//Route
router.use((err, req, res, next) =>
{
  logger.error(`Incurred ${err} at ${req.baseUrl}`);

  res.status(500);
  return res.json({
    error: {
      name: 'Internal Error',
      description: 'An internal error occured! If this persists, please contact your administrator.'
    }
  });
});

//Export
module.exports = router;
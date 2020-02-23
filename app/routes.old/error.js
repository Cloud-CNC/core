/**
 * @fileoverview Error route
 */

//Imports
const router = require('express').Router();

//Route
router.use((err, req, res, next) =>
{
  res.locals.log.error(`Incurred ${err} at ${req.baseUrl}`);
  return res.send(err);
});

//Export
module.exports = router;
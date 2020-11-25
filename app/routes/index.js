/**
 * @fileoverview Cloud CNC routes
 */

//Imports
const router = require('express').Router();

//Bind routes to file
router.use('/api', require('./api.js'));
router.use(require('./404.js'));
router.use(require('./error.js'));

//Export
module.exports = router;
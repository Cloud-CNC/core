/**
 * @fileoverview Cloud CNC API routes
 */

//Imports
const router = require('express').Router();

//Bind routes to file
router.use('/accounts', require('./accounts.js'));
router.use('/controllers', require('./controllers.js'));
router.use('/files', require('./files.js'));
router.use('/machines', require('./machines.js'));
router.use('/sessions', require('./sessions.js'));
router.use('/trash', require('./trash.js'));

//Export
module.exports = router;
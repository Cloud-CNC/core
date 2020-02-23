/**
 * @fileoverview Cloud CNC API routes
 */

//Imports
const router = require('express').Router();

//Bind routes to file
router.use('/accounts', require('./accounts'));
//router.use('/controllers', require('./controllers'));
//router.use('/files', require('./files'));
//router.use('/machines', require('./machines'));
router.use('/sessions', require('./sessions'));
//router.use('/trash', require('./trash'));

//Export
module.exports = router;
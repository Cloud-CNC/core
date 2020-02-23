/**
 * @fileoverview Sessions routes
 */

//Imports
const controller = require('../controllers/session.js');
const router = require('express').Router();

//Routes
router.post('/login', controller.login);
router.post('/mfa', controller.mfa);
router.post('/logout', controller.logout);

//Export
module.exports = router;
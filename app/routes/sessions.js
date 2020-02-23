/**
 * @fileoverview Sessions routes
 */

//Imports
const controller = require('../controllers/session.js');
const router = require('express').Router();
const {body} = require('../middleware/validator');
const {filters} = require('../../config');

//Log user in
router.post('/login',
  body('username', filters.username),
  body('password', filters.password),
  async (req, res) =>
  {
    return res.json(await controller.login(req.session, req.body.username, req.body.password));
  });

//Finish authenticating user via MFA
router.post('/mfa',
  body('otp', filters.otp),
  async (req, res) =>
  {
    return res.json(await controller.mfa(req.session, req.body.otp));
  });

//Log user out
router.post('/logout',
  async (req, res) =>
  {
    return res.json(await controller.logout(req.session));
  });

//Export
module.exports = router;
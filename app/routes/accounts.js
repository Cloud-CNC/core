/**
 * @fileoverview Accounts Routes
 */

//Imports
const {onePlus, body} = require('../lib/validator');
const config = require('config');
const controller = require('../controllers/account');
const filters = require('../lib/filters');
const model = require('../models/account');
const mongoose = require('mongoose');
const permission = require('../middleware/permission');
const router = require('express').Router();

//Get target account
router.param('id',
  async (req, res, next, param) =>
  {
    //Validate ID
    if (mongoose.Types.ObjectId.isValid(param) && await model.findById(param) != null)
    {
      req.account = param;
      next();
    }
    else if (param == 'own')
    {
      req.account = req.user._id;
      next();
    }
    else
    {
      return res.status(404).json({
        error: {
          name: 'Invalid Account',
          description: 'The specified account doesn\'t exist!'
        }
      });
    }
  });

//Get all accounts
router.get('/all',
  permission('accounts:all'),
  async (req, res) =>
  {
    return res.json(await controller.all());
  });

//Get all roles
router.get('/roles',
  permission('accounts:roles'),
  (req, res) =>
  {
    return res.json(controller.roles());
  });

//Create an account
router.post('/',
  permission('accounts:create'),
  body('username', filters.username),
  body('password', filters.password),
  body('mfa', filters.boolean),
  body('role', value => Object.keys(config.get('core.acl.roles')).includes(value)),
  async (req, res) =>
  {
    return res.json(await controller.create(req.body.username, req.body.password, req.body.mfa, req.body.role));
  });

//Start impersonating an account
router.post('/:id/impersonate/start',
  permission('accounts:impersonate:start'),
  async (req, res) =>
  {
    await controller.impersonate.start(req.session, req.account);
    return res.end();
  });

//Stop impersontaint an account
router.post('/impersonate/stop',
  permission('accounts:impersonate:stop'),
  async (req, res) =>
  {
    await controller.impersonate.stop(req.session);
    return res.end();
  });

//Get an account
router.get('/:id',
  permission('accounts:get'),
  async (req, res) =>
  {
    return res.json(await controller.get(req.account));
  });

//Update an account
router.patch('/:id',
  permission('accounts:update'),
  onePlus('body', {
    username: filters.username,
    password: filters.password,
    mfa: filters.boolean,
    role: value => Object.keys(config.get('core.acl.roles')).includes(value)
  }),
  async (req, res) =>
  {
    return res.json(await controller.update(req.account, req.session.user, req.data));
  });

//Remove an account
router.delete('/:id',
  permission('accounts:remove'),
  async (req, res) =>
  {
    return res.json(await controller.remove(req.account));
  });

//Export
module.exports = router;
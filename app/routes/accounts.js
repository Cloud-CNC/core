/**
 * @fileoverview Accounts routes
 */

//Imports
const controller = require('../controllers/account.js');
const model = require('../models/account.js');
const mongoose = require('mongoose');
const permission = require('../middleware/permission.js');
const router = require('express').Router();

//Get target account
router.param('id', async (req, res, next, param) =>
{
  //Validate
  if (mongoose.Types.ObjectId.isValid(param))
  {
    if (req.user.role == 'admin')
    {
    const doc = await model.findById(param);

    if (doc == null)
    {
      return res.status(404).json({
        error: {
          name: 'Invalid Account',
          description: 'The specified account doesn\'t exist!'
        }
      });
    }
    else
    {
      req.account = doc;
      next();
    }
  }
  else
  {
      res.status(401);
      return res.json({
        error: {
          name: 'Insufficient Permissions',
          description: 'You don\'t have the required permissions to perform this action!'
        }
      });
    }
  }
  else
  {
    req.account = req.user;
    next();
  }
});

//Routes
router.get('/all', permission('accounts:all'), controller.getAll);
router.post('/', permission('accounts:create'), controller.create);
router.post('/:id/impersonate/start', permission('accounts:impersonate:start'), controller.impersonateStart);
router.post('/impersonate/stop', permission('accounts:impersonate:stop'), controller.impersonateStop);
router.get('/:id', permission('accounts:get'), controller.get);
router.patch('/:id', permission('accounts:update'), controller.update);
router.delete('/:id', permission('accounts:remove'), controller.remove);

//Export
module.exports = router;
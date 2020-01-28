/**
 * @fileoverview Files routes
 */

//Imports
const accountModel = require('../models/account.js');
const controller = require('../controllers/file.js');
const fileModel = require('../models/file.js');
const mongoose = require('mongoose');
const permission = require('../middleware/permission.js');
const router = require('express').Router();

//Get target account
router.use(async (req, res, next) =>
{
  if (mongoose.Types.ObjectId.isValid(req.body.account))
  {
    if (req.user.role == 'admin')
    {
      req.account = await accountModel.findById(req.body.account);
      next();
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

//Get file
router.param('id', async (req, res, next, param) =>
{
  const doc = await fileModel.findById(param);

  if (doc == null)
  {
    return res.status(404).json({
      error: {
        name: 'Invalid File',
        description: 'The specified file doesn\'t exist!'
      }
    });
  }
  else if (!req.account._id.equals(doc.owner))
  {
    return res.status(403).json({
      error: {
        name: 'Insufficient Permissions',
        description: 'You don\'t have the required permissions to perform this action!'
      }
    });
  }
  else
  {
    req.file = doc;
    next();
  }
});

//Routes
router.get('/all', permission('files:all'), controller.getAll);
router.post('/', permission('files:create'), controller.create);
router.get('/:id', permission('files:get'), controller.get);
router.patch('/:id', permission('files:update'), controller.update);
router.delete('/:id', permission('files:remove'), controller.remove);

//Export
module.exports = router;
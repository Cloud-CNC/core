/**
 * @fileoverview Trash routes
 */

//Imports
const accountModel = require('../models/account.js');
const controller = require('../controllers/trash.js');
const fileModel = require('../models/file.js');
const mongoose = require('mongoose');
const permission = require('../middleware/permission.js');
const router = require('express').Router();

//Get file
router.param('id', async (req, res, next, param) =>
{
  const doc = await fileModel.findById(param);

  if (doc == null)
  {
    return res.json({
      error: {
        name: 'Invalid File',
        description: 'The specified file doesn\'t exist!'
      }
    });
  }
  else
  {
    req.file = doc;
    next();
  }
});

//Get target account
router.use(async (req, res, next) =>
{
  if (mongoose.Types.ObjectId.isValid(req.body.account))
  {
    if (req.session.user.role == 'admin')
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
    //Get account again because the session version was JSONified
    req.account = await accountModel.findById(req.session.user._id);
    next();
  }
});

//Routes
router.get('/all', permission('trash:all'), controller.getAll);
router.put('/:id', permission('trash:recover'), controller.recover);
router.delete('/:id', permission('trash:remove'), controller.delete);

//Export
module.exports = router;
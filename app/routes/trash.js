/**
 * @fileoverview Trash Routes
 */

//Imports
const controller = require('../controllers/trash');
const model = require('../models/file');
const mongoose = require('mongoose');
const permission = require('../middleware/permission');
const router = require('express').Router();

//Get target file
router.param('id',
  async (req, res, next, param) =>
  {
    //Validate ID
    if (mongoose.Types.ObjectId.isValid(param) && await model.findById(param) != null)
    {
      req.file = param;
      next();
    }
    else
    {
      return res.status(404).json({
        error: {
          name: 'Invalid File',
          description: 'The specified file doesn\'t exist!'
        }
      });
    }
  });

//Get all trash
router.get('/all',
  permission('trash:all'),
  async (req, res) =>
  {
    return res.json(await controller.all(req.user._id));
  });

//Recover a file
router.put('/:id',
  permission('trash:recover'),
  async (req, res) =>
  {
    await controller.recover(req.file);
    return res.end();
  });

//Remove a file permanently
router.delete('/:id',
  permission('trash:remove'),
  async (req, res) =>
  {
    await controller.remove(req.file);
    return res.end();
  });

//Export
module.exports = router;
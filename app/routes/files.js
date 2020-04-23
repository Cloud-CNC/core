/**
 * @fileoverview File Routes
 */

//Imports
const controller = require('../controllers/file');
const model = require('../models/file');
const mongoose = require('mongoose');
const permission = require('../middleware/permission');
const router = require('express').Router();
const filters = require('../lib/filters');
const {onePlus, body} = require('../middleware/validator');

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

//Get all files
router.get('/all',
  permission('files:all'),
  async (req, res) =>
  {
    return res.json(await controller.all(req.user._id));
  });

//Create a file
router.post('/',
  permission('files:create'),
  body('name', filters.name),
  body('description', filters.description),
  body('raw', value => value != null),
  async (req, res) =>
  {
    return res.json(await controller.create(req.user._id, req.body.name, req.body.description, req.body.raw));
  });

//Get a file
router.get('/:id',
  permission('files:get'),
  async (req, res) =>
  {
    return res.json(await controller.get(req.file));
  });

//Update a file
router.patch('/:id',
  permission('files:update'),
  onePlus('body', {
    name: filters.name,
    description: filters.description
  }),
  async (req, res) =>
  {
    await controller.update(req.file, req.data);
    return res.end();
  });

//Remove a file
router.delete('/:id',
  permission('files:remove'),
  async (req, res) =>
  {
    await controller.remove(req.file);
    return res.end();
  });

//Export
module.exports = router;
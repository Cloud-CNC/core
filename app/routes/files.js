/**
 * @fileoverview File Routes
 */

//Imports
const {onePlus, field, file} = require('../lib/validator');
const controller = require('../controllers/file');
const filters = require('../lib/filters');
const model = require('../models/file');
const mongoose = require('mongoose');
const multipart = require('../middleware/multipart');
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
  multipart(),
  field('name', filters.name),
  field('description', filters.description),
  file('raw'),
  async (req, res) =>
  {
    return res.json(await controller.create(req.user._id, req.fields.name, req.fields.description, req.files.raw.path, req.fields.extension));
  });

//Get a file's metadata
router.get('/:id',
  permission('files:get'),
  async (req, res) =>
  {
    return res.json(await controller.get(req.file));
  });

//Get a raw file
router.get('/:id/raw',
  permission('files:raw'),
  async (req, res) =>
  {
    return res.sendFile(controller.raw(req.file));
  });

//Update a file
router.patch('/:id',
  permission('files:update'),
  onePlus('body', {
    name: filters.name,
    description: filters.description,
    extension: filters.extension
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
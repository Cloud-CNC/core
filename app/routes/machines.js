/**
 * @fileoverview Machine Routes
 */

//Imports
const controller = require('../controllers/machine');
const model = require('../models/machine');
const mongoose = require('mongoose');
const permission = require('../middleware/permission');
const router = require('express').Router();
const {filters} = require('../../config');
const {onePlus, body} = require('../middleware/validator');

//Get target machine
router.param('id',
  async (req, res, next, param) =>
  {
    //Validate ID
    if (mongoose.Types.ObjectId.isValid(param) && await model.findById(param) != null)
    {
      req.machine = param;
      next();
    }
    else
    {
      return res.status(404).json({
        error: {
          name: 'Invalid Machine',
          description: 'The specified machine doesn\'t exist!'
        }
      });
    }
  });

//Get all machines
router.get('/all',
  permission('machines:all'),
  async (req, res) =>
  {
    return res.json(await controller.all());
  });

//Create a machine
router.post('/',
  permission('machines:create'),
  body('controller', mongoose.Types.ObjectId.isValid),
  body('name', filters.name),
  body('tags', filters.tags),
  body('length', value => typeof value == 'number'),
  body('width', value => typeof value == 'number'),
  body('height', value => typeof value == 'number'),
  async (req, res) =>
  {
    return res.json(await controller.create(req.body.controller, req.body.name, req.body.tags, req.body.length, req.body.width, req.body.height));
  });

//Command a machine
router.post('/:id/command',
  permission('machines:command'),
  body('command', value => value != null),
  async (req, res) =>
  {
    return res.json(await controller.command(req.machine, req.body.command));
  });

//Execute a file
router.post('/:id/execute',
  permission('machines:execute'),
  body('file', mongoose.Types.ObjectId.isValid),
  async (req, res) =>
  {
    return res.json(await controller.execute(req.machine, req.body.file));
  });

//Get a machine
router.get('/:id',
  permission('machines:get'),
  async (req, res) =>
  {
    return res.json(await controller.get(req.machine));
  });

//Update a machine
router.patch('/:id',
  (req, res, next) =>
  {
    next();
  },
  permission('machines:update'),
  onePlus('body', {
    controller: mongoose.Types.ObjectId.isValid,
    name: filters.name,
    tags: filters.tags,
    length: value => typeof value == 'number',
    width: value => typeof value == 'number',
    height: value => typeof value == 'number',
  }),
  async (req, res) =>
  {
    return res.json(await controller.update(req.machine, req.data));
  });

//Remove a machine
router.delete('/:id',
  permission('machines:remove'),
  async (req, res) =>
  {
    await controller.remove(req.machine);
    return res.end();
  });

//Export
module.exports = router;
/**
 * @fileoverview Controller Routes
 */

//Imports
const controller = require('../controllers/controller');
const model = require('../models/controller');
const mongoose = require('mongoose');
const permission = require('../middleware/permission');
const router = require('express').Router();
const {filters} = require('../../config');
const {onePlus, body} = require('../middleware/validator');

//Get target controller
router.param('id',
  async (req, res, next, param) =>
  {
    //Validate ID
    if (mongoose.Types.ObjectId.isValid(param) && await model.findById(param) != null)
    {
      req.controller = param;
      next();
    }
    else
    {
      return res.status(404).json({
        error: {
          name: 'Invalid Controller',
          description: 'The specified controller doesn\'t exist!'
        }
      });
    }
  });

//Get all controllers
router.get('/all',
  permission('controllers:all'),
  async (req, res) =>
  {
    return res.json(await controller.all());
  });

//Create a controller
router.post('/',
  permission('controllers:create'),
  body('name', filters.name),
  async (req, res) =>
  {
    return res.json(await controller.create(req.body.name));
  });

//Get a controller
router.get('/:id',
  permission('controllers:get'),
  async (req, res) =>
  {
    return res.json(await controller.get(req.controller));
  });

//Update a controller
router.patch('/:id',
  permission('controllers:update'),
  onePlus('body', {
    name: filters.name
  }),
  async (req, res) =>
  {
    await controller.update(req.controller, req.data);
    return res.end();
  });

//Remove a controller
router.delete('/:id',
  permission('controllers:remove'),
  async (req, res) =>
  {
    return res.json(await controller.remove(req.controller));
  });

//Export
module.exports = router;
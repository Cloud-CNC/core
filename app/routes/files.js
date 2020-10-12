/**
 * @fileoverview File Routes
 */

//Imports
const {onePlus, form} = require('../middleware/validator');
const controller = require('../controllers/file');
const filters = require('../lib/filters');
const {IncomingForm} = require('formidable');
const logger = require('../lib/logger');
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
  async (req, res) =>
  {
    const parser = new IncomingForm();

    //Parse upload with formidable
    const responseJSON = await new Promise(resolve => parser.parse(req, (err, fields, files) =>
    {
      //Handle error
      if (err)
      {
        logger.error(`Formidable error ${err} while uploading file`);

        return resolve({
          error: {
            name: 'Upload Error',
            description: 'An error occurred while uploading the file! Please try again or contact your administrator.'
          }
        });
      }

      if (files.raw == null)
      {
        return resolve({
          error: {
            name: 'File Upload',
            description: 'Expected the file to be indexed by the "raw" multipart field!'
          }
        });
      }

      //Input validation
      const nameValidation = form(fields, 'name', filters.name);
      const descriptionValidation = form(fields, 'description', filters.description);
      const extensionValidation = form(fields, 'extension', filters.extension);

      if (nameValidation != true)
      {
        return resolve(nameValidation);
      }

      if (descriptionValidation != true)
      {
        return resolve(descriptionValidation);
      }

      if (extensionValidation != true)
      {
        return resolve(extensionValidation);
      }

      //Execute controller
      return resolve(controller.create(req.user._id, fields.name, fields.description, files.raw.path, fields.extension));
    }));

    //Respond with JSON
    return res.json(responseJSON);
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
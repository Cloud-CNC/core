/**
 * @fileoverview "Controller" controller
 */

//Imports
const config = require('../../config.js');
const create = require('../lib/create.js');
const crypto = require('crypto');
const machineModel = require('../models/machine.js');
const model = require('../models/controller.js');
const update = require('../lib/update.js');

//Logic
module.exports = {
  getAll: async function (req, res)
  {
    const docs = await model.find();
    return res.json(docs.map(doc => doc.toJSON()));
  },
  create: async function (req, res)
  {
    const constructor = create(req.body, {
      name: config.filters.name
    }, res);

    if (constructor != null)
    {
      constructor.key = crypto.randomBytes(config.controller.keyLength).toString('base64');

      const doc = new model(constructor);
      await doc.save();
      return res.json({_id: doc.id, key: doc.key});
    }
  },
  get: function (req, res)
  {
    return res.json(req.controller.toJSON());
  },
  update: async function (req, res)
  {
    const success = update(req.body, req.controller, {
      name: config.filters.name
    }, res);

    if (success)
    {
      await req.controller.save();
      return res.end();
    }
  },
  remove: async function (req, res)
  {
    //Make sure no child machines exist
    const machines = await machineModel.find({controller: req.controller._id});

    if (machines.length > 0)
    {
      return res.status(409).json({
        error: {
          name: 'Child Machines',
          description: 'The controller you\'re attempting to remove still owns machine(s). Please update or remove them before retrying.'
        }
      });
    }
    else
    {
      await req.controller.remove();
      return res.end();
    }
  }
};
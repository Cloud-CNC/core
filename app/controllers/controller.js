/**
 * @fileoverview "Controller" controller
 */

//Imports
const config = require('../../config.js');
const create = require('../lib/create.js');
const crypto = require('crypto');
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
  delete: async function (req, res)
  {
    await req.controller.remove();
    return res.end();
  }
};
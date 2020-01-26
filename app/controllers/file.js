/**
 * @fileoverview File controller
 */

//Imports
const config = require('../../config.js');
const create = require('../lib/create.js');
const fs = require('fs').promises;
const model = require('../models/file.js');
const path = require('path');
const update = require('../lib/update.js');

//Logic
module.exports = {
  getAll: async function (req, res)
  {
    const docs = await model.find({owner: req.account._id, status: 0}).exec();
    return res.json(docs.map(doc => doc.toJSON()));
  },
  create: async function (req, res)
  {
    const constructor = create(req.body, {
      name: config.filters.name,
      description: config.filters.description
    }, res);

    if (constructor != null)
    {
      constructor.owner = req.account._id;

      const doc = new model(constructor);
      await doc.save();

      await fs.writeFile(`${path.join(config.data.filesystem, doc.id)}.gcode`, req.body.raw);

      return res.json({_id: doc.id});
    }
  },
  get: async function (req, res)
  {
    const raw = await fs.readFile(`${path.join(config.data.filesystem, req.file.id)}.gcode`, 'utf8');
    return res.json({...req.file.toJSON(), raw});
  },
  update: async function (req, res)
  {
    update(req.body, req.file, {
      name: config.filters.name,
      description: config.filters.description
    }, res);
    await req.file.save();
    return res.end();
  },
  delete: async function (req, res)
  {
    req.file.status = 1;
    await req.file.save();
    return res.end();
  }
};
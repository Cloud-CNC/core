/**
 * @fileoverview Trash controller
 */

//Imports
const config = require('../../config.js');
const fs = require('fs').promises;
const model = require('../models/file.js');
const path = require('path');

//Logic
module.exports = {
  getAll: async function (req, res)
  {
    const docs = await model.find({status: 1}).exec();
    return res.json(docs.map(doc => doc.toJSON()));
  },
  recover: async function (req, res)
  {
    req.file.status = 0;
    await req.file.save();
    return res.end();
  },
  remove: async function (req, res)
  {
    await fs.unlink(`${path.join(config.data.filesystem, req.file.id)}.gcode`);
    await req.file.remove();
    return res.end();
  }
};
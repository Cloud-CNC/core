/**
 * @fileoverview File model
 */

//Imports
const idValidator = require('mongoose-id-validator');
const mongoose = require('mongoose');
const filters = require('../lib/filters');

//Schema
const schema = new mongoose.Schema({
  status: {type: Number, default: 0, validate: filters.status, required: true},
  owner: {type: mongoose.Types.ObjectId, validate: mongoose.Types.ObjectId.isValid, ref: 'account', required: true},
  name: {type: String, validate: filters.name, required: true},
  description: {type: String, validate: filters.description}
});

//Plugins
schema.plugin(idValidator);

//Export
module.exports = mongoose.model('file', schema);
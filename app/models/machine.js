/**
 * @fileoverview Machine model
 */

//Imports
const idValidator = require('mongoose-id-validator');
const mongoose = require('mongoose');
const {filters} = require('../../config.js');

//Schema
const schema = new mongoose.Schema({
  controller: {type: mongoose.Types.ObjectId, validate: mongoose.Types.ObjectId.isValid, ref: 'controller', required: true},
  name: {type: String, validate: filters.name, required: true},
  tags: {type: [String], validate: filters.tags},
  length: {type: Number, required: true},
  width: {type: Number, required: true},
  height: {type: Number, required: true}
});

//Plugins
schema.plugin(idValidator);

//Export
module.exports = mongoose.model('machine', schema);
/**
 * @fileoverview Controller model
 */

//Imports
const mongoose = require('mongoose');
const {filters} = require('../../config.js');

//Schema
const schema = new mongoose.Schema({
  name: {type: String, validate: filters.name, required: true},
  key: {type: String, validate: filters.key, required: true}
});

//Export
module.exports = mongoose.model('controller', schema);
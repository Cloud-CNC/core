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

//Statics
schema.statics = {
  create: function (data, cb)
  {
    const machine = new this(data);
    machine.save(cb);
  },
  get: function (query, cb)
  {
    this.find(query, cb);
  },
  update: function (query, data, cb)
  {
    this.findOneAndUpdate(query, {$set: data}, {new: true}, cb);
  },
  remove: function(query, cb)
  {
    this.findOneAndDelete(query, cb);
  }
};

//Plugins
schema.plugin(idValidator);

//Export
module.exports = mongoose.model('machine', schema);
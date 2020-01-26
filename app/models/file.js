/**
 * @fileoverview File model
 */

//Imports
const mongoose = require('mongoose');
const {filters} = require('../../config.js');

//Schema
const schema = new mongoose.Schema({
  status: {type: Number, default: 0, validate: filters.status, required: true},
  owner: {type: mongoose.Types.ObjectId, validate: mongoose.Types.ObjectId.isValid, required: true},
  name: {type: String, validate: filters.name, required: true},
  description: {type: String, validate: filters.description}
});

//Statics
schema.statics = {
  create: function (data, cb)
  {
    const file = new this(data);
    file.save(cb);
  },
  get: function (query, cb)
  {
    this.find(query, cb);
  },
  update: function (query, data, cb)
  {
    this.findOneAndUpdate(query, {$set: data}, {new: true}, cb);
  },
  delete: function(query, cb)
  {
    this.findOneAndDelete(query, cb);
  }
};

//Export
module.exports = mongoose.model('file', schema);
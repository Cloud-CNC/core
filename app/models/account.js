/**
 * @fileoverview Account model
 */

//Imports
const mongoose = require('mongoose');
const {filters} = require('../../config.js');

//Schema
const schema = new mongoose.Schema({
  role: {type: String, validate: filters.role, default: 'user', required: true},
  username: {type: String, validate: filters.name, unique: true, required: true},
  firstName: {type: String, validate: filters.name, required: true},
  lastName: {type: String, validate: filters.name, required: true},
  hmac: {type: String, required: true}
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
  delete: function (query, cb)
  {
    this.findOneAndDelete(query, cb);
  }
};

//Export
module.exports = mongoose.model('account', schema);
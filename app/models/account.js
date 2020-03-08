/**
 * @fileoverview Account model
 */

//Imports
const mongoose = require('mongoose');
const {core} = require('../../config');
const {filters} = require('../../config.js');

//Schema
const schema = new mongoose.Schema({
  role: {type: String, validate: role => Object.keys(core.acl.roles).includes(role), default: 'user', required: true},
  username: {type: String, validate: filters.name, unique: true, required: true},
  hash: {type: String, required: true},
  mfa: {type: Boolean, required: true, default: false},
  secret: {type: String}
});

//Export
module.exports = mongoose.model('account', schema);
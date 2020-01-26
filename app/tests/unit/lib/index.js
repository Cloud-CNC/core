/**
 * @fileoverview Lib tests
 */

//Export
module.exports = () =>
{
  describe('Create', require('./create.js'));
  describe('Hash', require('./hash.js'));
  describe('Mongo', require('./mongo.js'));
  describe('Update', require('./update.js'));
};
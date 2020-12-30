/**
 * @fileoverview Lib tests
 */

//Export
module.exports = () =>
{
  describe('Hash', require('./hash.js'));
  describe('Mongo', require('./mongo.js'));
  describe('Redis', require('./redis.js'));
};
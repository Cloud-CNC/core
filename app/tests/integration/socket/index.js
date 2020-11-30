/**
 * @fileoverview Socket tests
 */

//Export
module.exports = () =>
{
  //Run tests
  describe('Authenticate', require('./authenticate.js'));
  describe('Connection', require('./connection.js'));
};
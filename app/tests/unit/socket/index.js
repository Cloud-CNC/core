/**
 * @fileoverview Socket tests
 */

//Export
module.exports = () =>
{
  describe('Authenticate', require('./authenticate.js'));
  describe('Connection', require('./connection.js'));
  describe('Server', require('./server.js'));
};
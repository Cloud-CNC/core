/**
 * @fileoverview Websocket tests
 */

//Export
module.exports = () =>
{
  describe('Authenticate', require('./authenticate.js'));
  describe('Connection', require('./connection.js'));
  describe('Store', require('./store.js'));
};
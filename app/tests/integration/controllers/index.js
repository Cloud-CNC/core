/**
 * @fileoverview Controllers tests
 */

//Export
module.exports = () =>
{
  describe('Account', require('./account.js'));
  describe('Controller', require('./controller.js'));
  describe('File', require('./file.js'));
  describe('Machine', require('./machine.js'));
  describe('Session', require('./session.js'));
  describe('Trash', require('./trash.js'));
};
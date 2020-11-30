/**
 * @fileoverview Unit tests
 */

//Tests
module.exports = () =>
{
  describe('Lib', require('./lib/index.js'));
  describe('Middleware', require('./middleware/index.js'));
  describe('Models', require('./models/index.js'));
  describe('Socket', require('./socket/index.js'));
};
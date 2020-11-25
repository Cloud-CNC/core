/**
 * @fileoverview Integration tests
 */

//Tests
module.exports = () =>
{
  describe('Routes', require('./routes/index.js'));
  describe('Websocket', require('./websocket/index.js'));
};
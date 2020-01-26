/**
 * @fileoverview Integration tests
 */

//Tests
module.exports = () =>
{
  describe('Controllers', require('./controllers/index.js'));
  describe('Routes', require('./routes/index.js'));
  describe('Websocket', require('./websocket/index.js'));
};
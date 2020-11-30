/**
 * @fileoverview Integration tests
 */

//Tests
module.exports = () =>
{
  describe('Routes', require('./routes/index.js'));
  describe('Socket', require('./socket/index.js'));
};
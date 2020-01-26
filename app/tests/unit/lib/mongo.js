/**
 * @fileoverview Mongo tests
 */

//Imports
const expect = require('chai').expect;
const mongo = require('../../../lib/mongo.js');

//Export
module.exports = () =>
{
  it('should connect to database', () =>
  {
    mongo().then(mongoose =>
    {
      expect(mongoose.connection.readyState).to.equal(1);
    });
  });
};
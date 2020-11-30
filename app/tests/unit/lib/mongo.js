/**
 * @fileoverview Mongo tests
 */

//Imports
const expect = require('chai').expect;
const mongo = require('../../../lib/mongo.js');
const mongoose = require('mongoose');

//Export
module.exports = () =>
{
  it('will access MongoDB', () =>
  {
    expect(mongo.connect().connection.readyState).to.equal(mongoose.STATES.connected);
  });
};
/**
 * @fileoverview Redis tests
 */

//Imports
const expect = require('chai').expect;
const redis = require('../../../lib/redis.js');

//Export
module.exports = () =>
{
  it('will access RedisDB', () =>
  {
    expect(redis.connect()).to.not.be.null;
    expect(redis.client).to.not.be.null;
  });
};
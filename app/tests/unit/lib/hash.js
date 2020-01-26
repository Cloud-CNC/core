/**
 * @fileoverview Hasher tests
 */

//Imports
const argon2 = require('argon2');
const expect = require('chai').expect;
const hash = require('../../../lib/hash.js');

//Export
module.exports = () =>
{
  it('should hash correctly', async () =>
  {
    const test = 'Hello, world!';
    const hmac = await hash(test);
    expect(await argon2.verify(hmac, test)).to.be.true;
  });
};
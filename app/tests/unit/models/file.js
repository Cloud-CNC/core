/**
 * @fileoverview File model tests
 */

//Imports
const expect = require('chai').expect;
const model = require('../../../models/file.js');
const mongoose = require('mongoose');

//Export
module.exports = () =>
{
  it('should reject null parameters', async () =>
  {
    const doc = new model();
    await doc.validate(err =>
    {
      expect(err).to.not.be.null;
    });
  });

  it('should accept valid parameters', async () =>
  {
    const doc = new model({
      owner: new mongoose.Types.ObjectId('5e054e773f7093daf13a41e0'),
      name: 'abc',
      description: 'def'
    });
    await doc.validate(err =>
    {
      expect(err).to.be.null;
    });
  });
};
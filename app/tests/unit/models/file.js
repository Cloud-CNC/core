/**
 * @fileoverview File model tests
 */

//Imports
const accountModel = require('../../../models/account.js');
const expect = require('chai').expect;
const model = require('../../../models/file.js');

//Document
let account;

//Export
module.exports = () =>
{
  //Create account
  before(async () =>
  {
    account = new accountModel({
      role: 'admin',
      username: 'abc',
      hash: '$argon2id$v=19$m=65536,t=3,p=12$dMaFGvt1Bq3utN1FSQS3Ag$PIArM+hQPWCgM1xnUUvIqX8fK03A37mmLuSo7AoyK6I',
      mfa: false
    });
    await account.save();
  });

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
      owner: account._id,
      name: 'abc',
      description: 'def'
    });
    await doc.validate(err =>
    {
      expect(err).to.be.null;
    });
  });

  //Cleanup
  after(async () =>
  {
    await account.remove();
  });
};
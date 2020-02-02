/**
 * @fileoverview Routes tests
 */

//Imports
const model = require('../../../models/account.js');
let mongo = require('../../../lib/mongo.js');

//Dummy account
let doc;

//Export
module.exports = () =>
{
  //Create account
  before(async () =>
  {
    doc = new model({
      role: 'admin',
      username: 'abc',
      firstName: 'def',
      lastName: 'ghi',
      hmac: '$argon2id$v=19$m=65536,t=3,p=12$dMaFGvt1Bq3utN1FSQS3Ag$PIArM+hQPWCgM1xnUUvIqX8fK03A37mmLuSo7AoyK6I',
      mfa: false
    });
    await doc.save();
  });

  describe('Session', require('./session.js'));
  describe('Account', require('./account.js'));
  describe('Controller', require('./controller.js'));
  describe('File', require('./file.js'));
  describe('Machine', require('./machine.js'));
  describe('Trash', require('./trash.js'));

  //Cleanup
  after(async () =>
  {
    await doc.remove();
    
    mongo = await mongo();
    await mongo.connection.dropCollection('limits');
  });
};
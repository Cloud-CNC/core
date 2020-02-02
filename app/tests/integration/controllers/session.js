/**
 * @fileoverview Session controller tests
 */

//Imports
const controller = require('../../../controllers/session.js');
const expect = require('chai').expect;
const model = require('../../../models/account.js');
const speakeasy = require('speakeasy');

//Document
let doc;

//Export
module.exports = () =>
{
  //Create dummy account
  before(async () =>
  {
    doc = new model({
      username: 'abc',
      firstName: 'def',
      lastName: 'ghi',
      hmac: '$argon2id$v=19$m=65536,t=3,p=12$dMaFGvt1Bq3utN1FSQS3Ag$PIArM+hQPWCgM1xnUUvIqX8fK03A37mmLuSo7AoyK6I',
      mfa: true,
      secret: 'LN2T4PRFOVRCINZ4OA7UKKLCKNXXCJSE'
    });
    await doc.save();
  });

  it('shouldn\'t login with invalid credentials', done =>
  {
    controller.login({
      body: {
        username: 'abc',
        password: 'Notthetestingpassword123!'
      },
      session: {}
    }, {
      json: async res =>
      {
        expect(res).to.eql({valid: false});
        done();
      }
    });
  });

  it('should login with valid credentials ', done =>
  {
    controller.login({
      body: {
        username: 'abc',
        password: 'Testingpassword123!'
      },
      session: {}
    }, {
      json: async res =>
      {
        expect(res).to.eql({valid: true, mfa: true});

        controller.mfa({
          body: {
            otp: speakeasy.totp({
              encoding: 'base32',
              secret: 'LN2T4PRFOVRCINZ4OA7UKKLCKNXXCJSE'
            })
          },
          session: {},
          user: doc._doc
        }, {
          json: async res =>
          {
            expect(res).to.be.eql({valid: true});
            done();
          }
        });
      }
    });
  });

  it('should logout', done =>
  {
    controller.logout({
      session: {
        destroy: cb => cb()
      }
    }, {
      clearCookie: () => null,
      end: done
    });
  });

  //Cleanup
  after(async () =>
  {
    await doc.remove();
  });
};
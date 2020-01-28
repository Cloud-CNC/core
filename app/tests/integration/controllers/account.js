/**
 * @fileoverview Account controller tests
 */

//Imports
const controller = require('../../../controllers/account.js');
const expect = require('chai').expect;
const model = require('../../../models/account.js');

//Document
let doc;

//Export
module.exports = () =>
{
  it('should create an account', done =>
  {
    controller.create({
      body: {
        role: 'admin',
        username: 'ghi',
        firstName: 'jkl',
        lastName: 'mno',
        password: 'Testingpassword123!'
      }
    }, {
      json: async res =>
      {
        doc = await model.findById(res._id);
        done();
      }
    });
  });

  it('should get an account', done =>
  {
    controller.get({account: doc}, {
      json: account =>
      {
        expect(account).to.eql(doc._doc);
        done();
      }
    });
  });

  it('should get all accounts', async () =>
  {
    await controller.getAll(null, {
      json: accounts =>
      {
        expect(accounts[0]).to.eql(doc._doc);
      }
    });
  });

  it('should update an account', async () =>
  {
    const update = {
      role: 'user',
      username: 'rst',
      firstName: 'uvw',
      lastName: 'xyz',
      password: 'Testingpassword321!'
    };

    await controller.update({
      account: doc,
      body: update
    }, {
      end: () =>
      {
        expect(doc._doc).to.haveOwnProperty('role', 'user');
        expect(doc._doc).to.haveOwnProperty('username', 'rst');
        expect(doc._doc).to.haveOwnProperty('firstName', 'uvw');
        expect(doc._doc).to.haveOwnProperty('lastName', 'xyz');
      }
    });
  });

  it('should remove an account', async () =>
  {
    await controller.remove({
      account: doc
    }, {
      end: async () =>
      {
        expect(await model.find()).to.have.length(0);
      }
    });
  });
};
/**
 * @fileoverview File controller tests
 */

//Imports
const accountModel = require('../../../models/account.js');
const controller = require('../../../controllers/file.js');
const expect = require('chai').expect;
const model = require('../../../models/file.js');

//Document
let accountDoc;
let doc;

//Export
module.exports = () =>
{
  //Setup
  before(async () =>
  {
    accountDoc = new accountModel({
      role: 'admin',
      username: 'abc',
      firstName: 'def',
      lastName: 'ghi',
      hmac: '$argon2id$v=19$m=65536,t=3,p=12$dMaFGvt1Bq3utN1FSQS3Ag$PIArM+hQPWCgM1xnUUvIqX8fK03A37mmLuSo7AoyK6I'
    });
    await accountDoc.save();
  });

  it('should create a file', done =>
  {
    controller.create({
      account: {
        _id: accountDoc._id
      },
      body: {
        name: 'abc',
        description: 'def',
        raw: 'ghi'
      }
    }, {
      json: async res =>
      {
        doc = await model.findById(res._id);
        done();
      }
    });
  });

  it('should get a file', done =>
  {
    controller.get({file: doc}, {
      json: file =>
      {
        delete file.raw;
        expect(file).to.eql(doc._doc);
        done();
      }
    });
  });

  it('should get all files', async () =>
  {
    await controller.getAll({
      account: {
        _id: accountDoc._id
      },
    }, {
      json: files =>
      {
        delete files[0].raw;
        expect(files[0]).to.eql(doc._doc);
      }
    });
  });

  it('should update a file', async () =>
  {
    const update = {
      name: 'rst',
      description: 'uvw'
    };

    await controller.update({
      file: doc,
      body: update
    }, {
      end: () =>
      {
        expect(doc._doc).to.haveOwnProperty('name', 'rst');
        expect(doc._doc).to.haveOwnProperty('description', 'uvw');
      }
    });
  });

  it('should remove a file', async () =>
  {
    await controller.remove({
      file: doc
    }, {
      end: async () =>
      {
        expect(await model.find()).to.have.length(1);
        expect(doc._doc).to.haveOwnProperty('status', 1);
      }
    });
  });

  //Cleanup
  after(async () =>
  {
    await accountDoc.remove();
  });
};
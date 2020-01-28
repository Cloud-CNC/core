/**
 * @fileoverview File controller tests
 */

//Imports
const controller = require('../../../controllers/file.js');
const expect = require('chai').expect;
const model = require('../../../models/file.js');
const mongoose = require('mongoose');

//Document
let doc;

//Export
module.exports = () =>
{
  it('should create a file', done =>
  {
    controller.create({
      account: {
        _id: new mongoose.Types.ObjectId('5e054e773f7093daf13a41e0')
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
        _id: new mongoose.Types.ObjectId('5e054e773f7093daf13a41e0')
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
};
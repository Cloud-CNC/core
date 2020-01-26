/**
 * @fileoverview Trash controller tests
 */

//Imports
const controller = require('../../../controllers/trash.js');
const expect = require('chai').expect;
const model = require('../../../models/file.js');
const mongoose = require('mongoose');

//Document
let doc;

//Export
module.exports = () =>
{
  before(async () =>
  {
    doc = await model.findOne().exec();
  });

  it('should get all trash', async () =>
  {
    await controller.getAll(null, {
      json: files =>
      {
        expect(files).to.be.length(1);

        expect(files[0]).to.have.property('name', 'rst');
        expect(files[0]).to.have.property('description', 'uvw');
      }
    });
  });

  it('should recover a trashed file', async () =>
  {
    await controller.recover({
      file: doc
    }, {
      end: () =>
      {
        expect(doc._doc).to.have.property('name', 'rst');
        expect(doc._doc).to.have.property('description', 'uvw');
      }
    });
  });

  it('should delete a trashed file', async () =>
  {
    await controller.delete({
      file: doc
    }, {
      end: async () =>
      {
        expect(await model.find()).to.have.length(0);
      }
    });
  });
};
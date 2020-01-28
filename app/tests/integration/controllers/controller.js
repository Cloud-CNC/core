/**
 * @fileoverview "Controller" controller tests
 */

//Imports
const controller = require('../../../controllers/controller.js');
const expect = require('chai').expect;
const model = require('../../../models/controller.js');

//Document
let doc;

//Export
module.exports = () =>
{
  it('should create a controller', done =>
  {
    controller.create({
      body: {
        name: 'abc'
      }
    }, {
      json: async res =>
      {
        doc = await model.findById(res._id);
        expect(res.key).to.not.be.null;
        done();
      }
    });
  });

  it('should get a controller', done =>
  {
    controller.get({controller: doc}, {
      json: async controller =>
      {
        expect(controller).to.eql(doc._doc);
        done();
      }
    });
  });

  it('should get all controllers', async () =>
  {
    await controller.getAll(null, {
      json: async controllers =>
      {
        expect(controllers[0]).to.eql(doc._doc);
      }
    });
  });

  it('should update a controller', async () =>
  {
    const update = {
      name: 'xyz',
    };

    await controller.update({
      controller: doc,
      body: update
    }, {
      end: () =>
      {
        expect(doc._doc).to.haveOwnProperty('name', 'xyz');
        expect(doc._doc).to.haveOwnProperty('key');
      }
    });
  });

  it('should remove a controller', async () =>
  {
    await controller.remove({
      controller: doc
    }, {
      end: async () =>
      {
        expect(await model.find()).to.have.length(0);
      }
    });
  });
};
/**
 * @fileoverview Machine controller tests
 */

//Imports
const controller = require('../../../controllers/machine.js');
const controllerModel = require('../../../models/controller.js');
const expect = require('chai').expect;
const model = require('../../../models/machine.js');

//Documents
let doc;
let controllerDoc;

//Export
module.exports = () =>
{
  //Setup
  before(async () =>
  {
    controllerDoc = new controllerModel({
      name: 'abc',
      key: 'at592VFeO0ogmSOalVNHGTpw8TcXpZFgySWVTlHYhLIqHQbMO2fh63HihfSd8Zgx53WS6G2NbSX5sLUeNCJPN3evPePTGCI9YgbzwGWiEJg0M25mCGIfPsbrXN0qTGQO4sbgZWJQGEExKZttXCgOwY47Lb42zCBB9RKXO9XnO6DJcx6YRuRhVSS7wcxMp5rBOGZ4li2Zl2gM30upbZstzfTh06SHwE2HIut30FAgjA572xzvFtkyqP0kgcfuM9A0GEDJaVNFYAgd08FczeAyB3jn61nR5INn80td5nm3jMToIsVMwjonojL9ytYV1yh4eu0Xje7xppBP51AZKayscFsOaFp4VHuocfKSdcAGsDPqEXZxUBGGQTZvCnrLIrdIseuYKLR7CdDFUaeLqz3B9Hl600I5gvmFKfmW8KywKxlJQhEWwPEpSOTxS4N6y6T9MRGRq5pX12h2eVYSHrKgP9ReBOBha1WEd7o9akw2RhMHuzohOpoY1EHUnCbWa6MD'
    });
    await controllerDoc.save();
  });

  it('should create a machine', done =>
  {
    controller.create({
      body: {
        controller: controllerDoc._id,
        name: 'abc',
        tags: ['def', 'ghi'],
        length: 1,
        width: 1.0,
        height: 1.1
      }
    }, {
      json: async res =>
      {
        doc = await model.findById(res._id);
        doc = await doc.populate('controller').execPopulate();
        done();
      }
    });
  });

  it('should get a machine', done =>
  {
    controller.get({machine: doc}, {
      json: machine =>
      {
        expect(machine).to.eql(doc.toJSON());
        done();
      }
    });
  });

  it('should get all machines', async () =>
  {
    await controller.getAll(null, {
      json: machines =>
      {
        expect(machines[0]).to.eql(doc.toJSON());
      }
    });
  });

  it('should update a machine', async () =>
  {
    const update = {
      name: 'rst',
      tags: ['uvw', 'xyz'],
      length: 10,
      width: 10.0,
      height: 10.1
    };

    await controller.update({
      machine: doc,
      body: update
    }, {
      end: () =>
      {
        expect(doc._doc).to.deep.haveOwnProperty('controller', controllerDoc._id);
        expect(doc._doc).to.haveOwnProperty('name', 'rst');
        expect(doc._doc).to.deep.haveOwnProperty('tags', ['uvw', 'xyz']);
        expect(doc._doc).to.haveOwnProperty('length', 10);
        expect(doc._doc).to.haveOwnProperty('width', 10);
        expect(doc._doc).to.haveOwnProperty('height', 10.1);
      }
    });
  });

  it('should remove a machine', async () =>
  {
    await controller.remove({
      machine: doc
    }, {
      end: async () =>
      {
        expect(await model.find()).to.have.length(0);
      }
    });
  });

  //Cleanup
  after(async () =>
  {
    await controllerDoc.remove();
  });
};
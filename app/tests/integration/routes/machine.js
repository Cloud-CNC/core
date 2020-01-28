/**
 * @fileoverview Machine routes tests
 */

//Imports
const app = require('../../../../app.js');
const chai = require('chai');
const controllerModel = require('../../../models/controller.js');
const expect = require('chai').expect;
const model = require('../../../models/machine.js');

//Agent
const agent = chai.request.agent(app);

//Data
let id;
let controllerDoc;

//Export
module.exports = () =>
{
  //Setup
  before(async () =>
  {
    //Login
    await agent
      .post('/api/sessions/login')
      .send({
        username: 'abc',
        password: 'Testingpassword123!'
      });

    //Create mock controller
    controllerDoc = new controllerModel({
      name: 'abc',
      key: 'at592VFeO0ogmSOalVNHGTpw8TcXpZFgySWVTlHYhLIqHQbMO2fh63HihfSd8Zgx53WS6G2NbSX5sLUeNCJPN3evPePTGCI9YgbzwGWiEJg0M25mCGIfPsbrXN0qTGQO4sbgZWJQGEExKZttXCgOwY47Lb42zCBB9RKXO9XnO6DJcx6YRuRhVSS7wcxMp5rBOGZ4li2Zl2gM30upbZstzfTh06SHwE2HIut30FAgjA572xzvFtkyqP0kgcfuM9A0GEDJaVNFYAgd08FczeAyB3jn61nR5INn80td5nm3jMToIsVMwjonojL9ytYV1yh4eu0Xje7xppBP51AZKayscFsOaFp4VHuocfKSdcAGsDPqEXZxUBGGQTZvCnrLIrdIseuYKLR7CdDFUaeLqz3B9Hl600I5gvmFKfmW8KywKxlJQhEWwPEpSOTxS4N6y6T9MRGRq5pX12h2eVYSHrKgP9ReBOBha1WEd7o9akw2RhMHuzohOpoY1EHUnCbWa6MD'
    });
    await controllerDoc.save();
  });

  it('should create a machine', async () =>
  {
    const res = await agent
      .post('/api/machines')
      .send({
        controller: controllerDoc._id,
        name: 'abc',
        tags: ['def', 'ghi'],
        length: 1,
        width: 1.0,
        height: 1.1
      });

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).haveOwnProperty('_id');
    id = res.body._id;
  });

  it('should get a machine', async () =>
  {
    const res = await agent
      .get(`/api/machines/${id}`)
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.haveOwnProperty('controller');
    expect(res.body.controller).to.haveOwnProperty('_id');
    expect(res.body.controller).to.haveOwnProperty('name', 'abc');
    expect(res.body.controller).to.haveOwnProperty('key');
    expect(res.body).to.haveOwnProperty('name', 'abc');
    expect(res.body).to.deep.haveOwnProperty('tags', ['def', 'ghi']);
    expect(res.body).to.haveOwnProperty('length', 1);
    expect(res.body).to.haveOwnProperty('width', 1);
    expect(res.body).to.haveOwnProperty('height', 1.1);
  });

  it('should get all machines', async () =>
  {
    const res = await agent
      .get('/api/machines/all')
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.have.length(1);

    expect(res.body[0]).to.haveOwnProperty('controller');
    expect(res.body[0].controller).to.haveOwnProperty('_id');
    expect(res.body[0].controller).to.haveOwnProperty('name', 'abc');
    expect(res.body[0].controller).to.haveOwnProperty('key');
    expect(res.body[0]).to.haveOwnProperty('name', 'abc');
    expect(res.body[0]).to.deep.haveOwnProperty('tags', ['def', 'ghi']);
    expect(res.body[0]).to.haveOwnProperty('length', 1);
    expect(res.body[0]).to.haveOwnProperty('width', 1);
    expect(res.body[0]).to.haveOwnProperty('height', 1.1);
  });

  it('should update a machine', async () =>
  {
    const res = await agent
      .patch(`/api/machines/${id}`)
      .send({
        name: 'rst',
        tags: ['uvw', 'xyz'],
        length: 10,
        width: 10.0,
        height: 10.1
      });

    expect(res).to.have.status(200);

    const doc = await (await model.findOne()).populate('controller').execPopulate();
    expect(doc._doc).to.haveOwnProperty('controller');
    expect(doc._doc.controller._doc).to.haveOwnProperty('_id');
    expect(doc._doc.controller._doc).to.haveOwnProperty('name', 'abc');
    expect(doc._doc.controller._doc).to.haveOwnProperty('key');
    expect(doc._doc).to.haveOwnProperty('name', 'rst');
    expect(doc._doc).to.deep.haveOwnProperty('tags', ['uvw', 'xyz']);
    expect(doc._doc).to.haveOwnProperty('length', 10);
    expect(doc._doc).to.haveOwnProperty('width', 10);
    expect(doc._doc).to.haveOwnProperty('height', 10.1);
  });

  it('should remove a machine', async () =>
  {
    const res = await agent
      .delete(`/api/machines/${id}`)
      .send();

    expect(res).to.have.status(200);

    expect(await model.find()).to.have.length(0);
  });

  //Cleanup and logout
  after(async () =>
  {
    await controllerDoc.remove();
    await agent
      .post('/api/sessions/logout')
      .send();
  });
};
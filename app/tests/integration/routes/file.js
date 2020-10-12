/**
 * @fileoverview File routes tests
 */

//Imports
const app = require('../../../../app.js');
const chai = require('chai');
const expect = require('chai').expect;
const model = require('../../../models/file.js');

//Agent
const agent = chai.request.agent(app);

//Data
let id;

//Export
module.exports = () =>
{
  //Login
  before(async () =>
  {
    await agent
      .post('/api/sessions/login')
      .send({
        username: 'abc',
        password: 'Testingpassword123!'
      });
  });

  it('should create a file', async () =>
  {
    const res = await agent
      .post('/api/files')
      .field('name', 'abc')
      .field('description', 'def')
      .field('extension', 'ghi')
      .attach('raw', './app/tests/integration/routes/test.txt')
      .type('form');

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).haveOwnProperty('_id');
    id = res.body._id;
  });

  it('should get a file\'s metadata', async () =>
  {
    const res = await agent
      .get(`/api/files/${id}`)
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.haveOwnProperty('name', 'abc');
    expect(res.body).to.haveOwnProperty('description', 'def');
    expect(res.body).to.haveOwnProperty('extension', 'ghi');
  });

  it('should get a raw file', async () =>
  {
    const res = await agent
      .get(`/api/files/${id}/raw`)
      .buffer(true)
      .send();

    expect(res).to.have.status(200);
    expect(res.type).to.equal('application/octet-stream');

    expect(res.body).to.eql(Buffer.from([106, 107, 108]));
  });

  it('should get all files', async () =>
  {
    const res = await agent
      .get('/api/files/all')
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.have.length(1);

    expect(res.body[0]).to.haveOwnProperty('name', 'abc');
    expect(res.body[0]).to.haveOwnProperty('description', 'def');
    expect(res.body[0]).to.haveOwnProperty('extension', 'ghi');
  });

  it('should update a file', async () =>
  {
    const res = await agent
      .patch(`/api/files/${id}`)
      .send({
        name: 'rst',
        description: 'uvw',
        extension: 'xyz'
      });

    expect(res).to.have.status(200);

    const doc = await model.findOne();
    expect(doc._doc).to.haveOwnProperty('name', 'rst');
    expect(doc._doc).to.haveOwnProperty('description', 'uvw');
    expect(doc._doc).to.haveOwnProperty('extension', 'xyz');
  });

  it('should remove a file', async () =>
  {
    const res = await agent
      .delete(`/api/files/${id}`)
      .send();

    expect(res).to.have.status(200);

    const doc = await model.findOne();
    expect(doc._doc).to.haveOwnProperty('status', 1);
    expect(doc._doc).to.haveOwnProperty('name', 'rst');
    expect(doc._doc).to.haveOwnProperty('description', 'uvw');
    expect(doc._doc).to.haveOwnProperty('extension', 'xyz');
  });

  //Logout
  after(async () =>
  {
    await agent
      .post('/api/sessions/logout')
      .send();
  });
};
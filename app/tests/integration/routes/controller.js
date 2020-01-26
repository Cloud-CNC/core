/**
 * @fileoverview Controller routes tests
 */

//Imports
const app = require('../../../../app.js');
const chai = require('chai');
const expect = require('chai').expect;
const model = require('../../../models/controller.js');

//Agent
const agent = chai.request.agent(app);

//ID
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

  it('should create a controller', async () =>
  {
    const res = await agent
      .post('/api/controllers')
      .send({
        name: 'abc'
      });

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.haveOwnProperty('_id');
    expect(res.body).to.haveOwnProperty('key');
    id = res.body._id;
  });

  it('should get a controller', async () =>
  {
    const res = await agent
      .get(`/api/controllers/${id}`)
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.haveOwnProperty('name', 'abc');
    expect(res.body).to.haveOwnProperty('key');
  });

  it('should get all controllers', async () =>
  {
    const res = await agent
      .get('/api/controllers/all')
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.have.length(1);

    expect(res.body[0]).to.haveOwnProperty('name', 'abc');
    expect(res.body[0]).to.haveOwnProperty('key');
  });

  it('should update a controller', async () =>
  {
    const res = await agent
      .patch(`/api/controllers/${id}`)
      .send({
        name: 'xyz',
      });

    expect(res).to.have.status(200);

    const doc = await model.findOne();
    expect(doc._doc).to.haveOwnProperty('name', 'xyz');
    expect(doc._doc).to.haveOwnProperty('key');
  });

  it('should delete a controler', async () =>
  {
    const res = await agent
      .delete(`/api/controllers/${id}`)
      .send();

    expect(res).to.have.status(200);

    expect(await model.find()).to.have.length(0);
  });

  //Logout
  after(async () =>
  {
    await agent
      .post('/api/sessions/logout')
      .send();
  });
};
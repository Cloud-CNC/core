/**
 * @fileoverview Trash routes tests
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

  it('should get all trash', async () =>
  {
    const res = await agent
      .get('/api/trash/all')
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.have.length(1);

    expect(res.body[0]).to.have.property('name', 'rst');
    expect(res.body[0]).to.have.property('description', 'uvw');

    id = res.body[0]._id;
  });

  it('should recover a trashed file', async () =>
  {
    const res = await agent
      .put(`/api/trash/${id}`)
      .send();

    expect(res).to.have.status(200);

    const doc = await model.findOne();
    expect(doc._doc).to.haveOwnProperty('status', 0);
    expect(doc._doc).to.haveOwnProperty('name', 'rst');
    expect(doc._doc).to.haveOwnProperty('description', 'uvw');
  });

  it('should delete a file', async () =>
  {
    await agent
      .delete(`/api/files/${id}`)
      .send();

    const res = await agent
      .delete(`/api/trash/${id}`)
      .send();

    expect(res).to.have.status(200);
  });

  //Logout
  after(async () =>
  {
    await agent
      .post('/api/sessions/logout')
      .send();
  });
};
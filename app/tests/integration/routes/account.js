/**
 * @fileoverview Account routes tests
 */

//Imports
const app = require('../../../../app.js');
const chai = require('chai');
const expect = require('chai').expect;
const model = require('../../../models/account.js');

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

  it('should create an account', async () =>
  {
    const res = await agent
      .post('/api/accounts')
      .send({
        role: 'user',
        username: 'rst',
        firstName: 'uvw',
        lastName: 'xyz',
        password: 'Testingpassword123!',
        mfa: true
      });

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).haveOwnProperty('_id');
    id = res.body._id;
  });

  it('should get own account', async () =>
  {
    const res = await agent
      .get('/api/accounts/own')
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.haveOwnProperty('role', 'admin');
    expect(res.body).to.haveOwnProperty('username', 'abc');
    expect(res.body).to.haveOwnProperty('firstName', 'def');
    expect(res.body).to.haveOwnProperty('lastName', 'ghi');
    expect(res.body).to.haveOwnProperty('mfa', false);
  });

  it('should get an account', async () =>
  {
    const res = await agent
      .get(`/api/accounts/${id}`)
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.haveOwnProperty('role', 'user');
    expect(res.body).to.haveOwnProperty('username', 'rst');
    expect(res.body).to.haveOwnProperty('firstName', 'uvw');
    expect(res.body).to.haveOwnProperty('lastName', 'xyz');
    expect(res.body).to.haveOwnProperty('mfa', true);
  });

  it('should get all accounts', async () =>
  {
    const res = await agent
      .get('/api/accounts/all')
      .send();

    expect(res).to.have.status(200);
    expect(res).to.be.json;

    expect(res.body).to.have.length(2);

    expect(res.body[0]).to.haveOwnProperty('role', 'admin');
    expect(res.body[0]).to.haveOwnProperty('username', 'abc');
    expect(res.body[0]).to.haveOwnProperty('firstName', 'def');
    expect(res.body[0]).to.haveOwnProperty('lastName', 'ghi');
    expect(res.body[0]).to.haveOwnProperty('mfa', false);

    expect(res.body[1]).to.haveOwnProperty('role', 'user');
    expect(res.body[1]).to.haveOwnProperty('username', 'rst');
    expect(res.body[1]).to.haveOwnProperty('firstName', 'uvw');
    expect(res.body[1]).to.haveOwnProperty('lastName', 'xyz');
    expect(res.body[1]).to.haveOwnProperty('mfa', true);
  });

  it('should update an account', async () =>
  {
    const res = await agent
      .patch(`/api/accounts/${id}`)
      .send({
        role: 'admin',
        username: 'jkl',
        firstName: 'mno',
        lastName: 'pqr',
        password: 'Testingpassword321!',
        mfa: false
      });

    expect(res).to.have.status(200);

    const doc = (await model.find())[1];
    expect(doc._doc).to.haveOwnProperty('role', 'admin');
    expect(doc._doc).to.haveOwnProperty('username', 'jkl');
    expect(doc._doc).to.haveOwnProperty('firstName', 'mno');
    expect(doc._doc).to.haveOwnProperty('lastName', 'pqr');
    expect(doc._doc).to.haveOwnProperty('mfa', false);
  });

  it('should remove an account', async () =>
  {
    const res = await agent
      .delete(`/api/accounts/${id}`)
      .send();

    expect(res).to.have.status(200);

    expect(await model.find()).to.have.length(1);
  });

  //Logout
  after(async () =>
  {
    await agent
      .post('/api/sessions/logout')
      .send();
  });
};
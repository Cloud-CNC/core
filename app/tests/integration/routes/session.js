/**
 * @fileoverview Session routes tests
 */

//Imports
const app = require('../../../../app.js');
const chai = require('chai');
const expect = require('chai').expect;

//Agent
const agent = chai.request.agent(app);

//Export
module.exports = () =>
{
  it('shouldn\'t login with invalid credentials', async () =>
  {
    const res = await agent
      .post('/api/sessions/login')
      .send({
        username: 'abc',
        password: 'Notthetestingpassword123!'
      });

    expect(res).to.not.have.cookie('session');
    expect(res.body).to.eql({valid: false});
  });

  it('should login with valid credentials ', async () =>
  {
    const res = await agent
      .post('/api/sessions/login')
      .send({
        username: 'abc',
        password: 'Testingpassword123!'
      });

    expect(res).to.have.cookie('session');
    expect(res.body).to.eql({valid: true, mfa: false});
  });

  it('should logout', async () =>
  {
    const res = await agent
      .post('/api/sessions/logout');

    expect(res).to.not.have.cookie('session');
  });
};
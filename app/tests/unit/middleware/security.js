/**
 * @fileoverview Security middleware tests
 */

//Imports
const app = require('../../../../app.js');
const chai = require('chai');
const expect = require('chai').expect;
const {core} = require('../../../../config.js');

//Agent
const agent = chai.request.agent(app);

//Data
let headers;

//Export
module.exports = () =>
{
  //Get headers
  before(async () =>
  {
    const res = await agent.get('/');
    headers = res.header;
  });

  it('should use CORS', () =>
  {
    expect(headers).to.haveOwnProperty('access-control-allow-origin', `https://${core.domain}`);
  });

  it('should use CSP', () =>
  {
    const csp = 'connect-src \'self\'; default-src \'self\'; style-src \'self\' \'unsafe-inline\'; worker-src \'self\' \'unsafe-inline\'; font-src \'self\' data:; script-src \'self\' \'unsafe-inline\'';
    expect(headers).to.haveOwnProperty('content-security-policy', csp);
    expect(headers).to.haveOwnProperty('x-content-security-policy', csp);
    expect(headers).to.haveOwnProperty('x-webkit-csp', csp);
  });

  it('shouldn\'t allow mime sniffing', () =>
  {
    expect(headers).to.haveOwnProperty('x-content-type-options', 'nosniff');
  });

  it('shouldn\'t use DNS prefetch', () =>
  {
    expect(headers).to.haveOwnProperty('x-dns-prefetch-control', 'off');
  });

  it('should prohibit executing downloads on IE', () =>
  {
    expect(headers).to.haveOwnProperty('x-download-options', 'noopen');
  });

  it('should use frameguard', () =>
  {
    expect(headers).to.haveOwnProperty('x-frame-options', 'SAMEORIGIN');
  });

  it('should prevent XSS', () =>
  {
    expect(headers).to.haveOwnProperty('x-xss-protection', '1; mode=block');
  });

  it('should prevent cross domain access', () =>
  {
    expect(headers).to.haveOwnProperty('x-permitted-cross-domain-policies', 'none');
  });

  it('should use CT', () =>
  {
    expect(headers).to.haveOwnProperty('expect-ct', 'enforce, max-age=0');
  });

  it('should use referrer policy', () =>
  {
    expect(headers).to.haveOwnProperty('referrer-policy', 'no-referrer');
  });

  it('should use HSTS', () =>
  {
    expect(headers).to.haveOwnProperty('strict-transport-security', 'max-age=5184000');
  });
};
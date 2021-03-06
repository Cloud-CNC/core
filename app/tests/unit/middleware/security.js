/**
 * @fileoverview Security middleware tests
 */

//Imports
const app = require('../../../../app.js');
const chai = require('chai');
const config = require('config');
const expect = require('chai').expect;

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
    headers = (await agent.get('/').set('origin', 'https://127.0.0.1:8443')).header;
  });

  it('should use CORS and allow request', () =>
  {
    expect(headers).to.haveOwnProperty('access-control-allow-origin', 'https://127.0.0.1:8443');
  });

  it('should use CORS and block request', async () =>
  {
    const res2 = await agent.get('/').set('origin', 'https://example.com');

    expect(res2.header).to.not.haveOwnProperty('access-control-allow-origin');
  });

  it('should use CSP', () =>
  {
    const csp = 'connect-src \'self\'; default-src \'self\'; style-src \'self\' \'unsafe-inline\'; worker-src \'self\' \'unsafe-inline\'; font-src \'self\' data:; script-src \'self\' \'unsafe-inline\' storage.googleapis.com';

    expect(csp).to.be.oneOf([headers['content-security-policy'], headers['x-content-security-policy'], headers['x-webkit-csp']]);
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
    expect(headers).to.haveOwnProperty('expect-ct', `enforce, max-age=${config.get('core.cryptography.ct')}`);
  });

  it('should use referrer policy', () =>
  {
    expect(headers).to.haveOwnProperty('referrer-policy', 'no-referrer');
  });

  it('should use HSTS', () =>
  {
    expect(headers).to.haveOwnProperty('strict-transport-security', `max-age=${config.get('core.cryptography.hsts')}`);
  });
};
/**
 * @fileoverview Tests
 */

//Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const syswideCA = require('syswide-cas');

//Enable self signed certificate
if (config.get('core.cryptography.selfSigned'))
{
  syswideCA.addCAs(config.get('core.cryptography.cert'));
}

//Chai
chai.use(chaiHttp);

//Tests
describe('Unit', require('./unit/index.js'));
describe('Integration', require('./integration/index.js'));
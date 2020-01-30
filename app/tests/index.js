/**
 * @fileoverview Tests
 */

//Environment variable (NOTE: Must be loaded before config)
process.env.NODE_ENV = 'testing';

//Imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const syswideCA = require('syswide-cas');
const {core} = require('../../config.js');

//Enable self signed certificate
syswideCA.addCAs(core.cert);

//Chai
chai.use(chaiHttp);

//Tests
describe('Unit', require('./unit/index.js'));
describe('Integration', require('./integration/index.js'));
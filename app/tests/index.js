/**
 * @fileoverview Tests
 */

//Imports
const chai = require('chai');
const chaiHttp = require('chai-http');

//Environment variable
process.env.NODE_ENV = 'testing';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//Chai
chai.use(chaiHttp);

//Tests
describe('Unit', require('./unit/index.js'));
//describe('Integration', require('./integration/index.js'));
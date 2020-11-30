/**
 * @fileoverview Socket server tests
 */

//Imports
const expect = require('chai').expect;
const socket = require('../../../socket/server.js');

//Export
module.exports = () =>
{
  it('will access the socket server', () =>
  {
    expect(socket.connect()).to.not.be.null;
    expect(socket.server).to.not.be.null;
  });
};
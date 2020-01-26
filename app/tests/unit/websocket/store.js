/**
 * @fileoverview Websocket store tests
 */

//Imports
const expect = require('chai').expect;
const store = require('../../../websocket/store.js');

//Export
module.exports = () =>
{
  it('should add socket to store', async () =>
  {
    store.add({key: 'value'}, 'testKey');
  });

  it('should get socket from store', async () =>
  {
    expect(store.get('testKey')).to.be.eql({key: 'value'});
  });

  it('should remove socket from store', async () =>
  {
    store.remove('testKey');
    expect(store.get('testKey')).to.be.undefined;
  });
};
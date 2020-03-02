/**
 * @fileoverview Websocket connection tests
 */

//Imports
const EventEmitter = require('events');
const connection = require('../../../websocket/connection.js');
const expect = require('chai').expect;
const store = require('../../../websocket/store.js');

//Data
let socket;

//Export
module.exports = () =>
{
  beforeEach(() =>
  {
    //Mock websocket
    socket = new EventEmitter();
    socket.ping = cb => cb();

    //Mock connection
    connection(socket, {
      headers: {
        _id: '5e2a7820b815352e8aeb5e53'
      }
    });
  });

  it('should remove broken controller', done =>
  {
    //Simulate websocket methods
    socket.ping = cb => cb('EXAMPLE-ERROR');
    socket.terminate = () =>
    {
      //Ensure socket is removed from store
      expect(store.get('5e2a7820b815352e8aeb5e53')).to.be.undefined;

      done();
    };
  });

  it('should emit message event', done =>
  {
    //Listen for echo
    socket.once('message', data =>
    {
      data = JSON.parse(data);
      expect(data).to.haveOwnProperty('key1', 'value1');
      expect(data).to.haveOwnProperty('key2', 'value2');
      done();
    });

    //Simulate response
    socket.emit('message', JSON.stringify({
      key1: 'value1',
      key2: 'value2'
    }));
  });

  it('should remove controller from store on disconnect', () =>
  {
    //Simulate close
    socket.emit('close');

    //Ensure socket is removed from store
    expect(store.get('5e2a7820b815352e8aeb5e53')).to.be.undefined;
  });
};
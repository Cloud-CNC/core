/**
 * @fileoverview Websocket authenticate tests
 */

//Imports
const expect = require('chai').expect;
const ws = require('ws');

//Data
const key1 = 'at592VFeO0ogmSOalVNHGTpw8TcXpZFgySWVTlHYhLIqHQbMO2fh63HihfSd8Zgx53WS6G2NbSX5sLUeNCJPN3evPePTGCI9YgbzwGWiEJg0M25mCGIfPsbrXN0qTGQO4sbgZWJQGEExKZttXCgOwY47Lb42zCBB9RKXO9XnO6DJcx6YRuRhVSS7wcxMp5rBOGZ4li2Zl2gM30upbZstzfTh06SHwE2HIut30FAgjA572xzvFtkyqP0kgcfuM9A0GEDJaVNFYAgd08FczeAyB3jn61nR5INn80td5nm3jMToIsVMwjonojL9ytYV1yh4eu0Xje7xppBP51AZKayscFsOaFp4VHuocfKSdcAGsDPqEXZxUBGGQTZvCnrLIrdIseuYKLR7CdDFUaeLqz3B9Hl600I5gvmFKfmW8KywKxlJQhEWwPEpSOTxS4N6y6T9MRGRq5pX12h2eVYSHrKgP9ReBOBha1WEd7o9akw2RhMHuzohOpoY1EHUnCbWa6MD';
const key2 = 'SRq22ztny8-LNrEl-8ut8hqzmlu_l9Cyi20quTesfI0NBXPeHTDBDAwQGmS6yeTvpdffT5m80yjnU_NP83G7cB8rOZ_DaQqFlcIZj3DhT1Ace285If5eNbvrvosqXK2UyJW6N6N02N8LrA5n6XUs0rVFdvb3RDD6bCiHK9Gs1yEL_-Hfv6Fetezs2sMPRKhTzuZE8ikJa5ZXGct3_oCUod7gnI7oXfFTHRhsGW1m20nPRpvxAqBeHtvSvvmw3WRWf9dhNC1oTSTGzMwvA-GpwDkITAleL-ryCVMeU_5-5qqNMVSPZomNvdX9plygmx0h37HBXZaJRJfLZpEv4sqH20zmw2XHUgAh9LG8OMqUIZD6JBCmiq5pALB8yt_toi6z8Xm-c4mIJJvJjRgGUBIrF0vba_CxU_OJwSetvYt7Zh1-SR2bVDnrOSAAZjp0J_aZDx8XAeWgQuOL5fP5RnO2zVKVvKy3PmYn528m09kwdRoN1b-MO1iWFpufth48wBQD';
let socket;

//Export
module.exports = () =>
{
  it('should deny controller for missing key', done =>
  {
    //Connect
    socket = new ws('wss://127.0.0.1', {
      headers: {
        _id: process.env.controllerID
      }
    });

    //Register error handler
    socket.once('error', err =>
    {
      expect(err.message).to.equal('Unexpected server response: 401');
      done();
    });
  });

  it('should deny controller for missing ID', done =>
  {
    //Connect
    socket = new ws('wss://127.0.0.1', {
      headers: {
        key: key1
      }
    });

    //Register error handler
    socket.once('error', err =>
    {
      expect(err.message).to.equal('Unexpected server response: 401');
      done();
    });
  });

  it('should deny controller for invalid key', done =>
  {
    //Connect
    socket = new ws('wss://127.0.0.1', {
      headers: {
        _id: process.env.controllerID,
        key: key2
      }
    });

    //Register error handler
    socket.once('error', err =>
    {
      expect(err.message).to.equal('Unexpected server response: 401');
      done();
    });
  });

  it('should deny controller for invalid ID', done =>
  {
    //Connect
    socket = new ws('wss://127.0.0.1', {
      headers: {
        _id: '5e2a7820b815352e8aeb5e53',
        key: key1
      }
    });

    //Register error handler
    socket.once('error', err =>
    {
      expect(err.message).to.equal('Unexpected server response: 401');
      done();
    });
  });

  it('should accept controller for valid key and ID', done =>
  {
    //Connect
    socket = new ws('wss://127.0.0.1', {
      headers: {
        _id: process.env.controllerID,
        key: key1
      }
    });

    //Register open handler
    socket.once('open', () =>
    {
      done();
    });
  });

  //Cleanup
  after(() =>
  {
    socket.close();
  });
};
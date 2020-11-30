/**
 * @fileoverview Socket connection tests
 */

//Imports
const connection = require('../../../socket/connection.js');
const controllerModel = require('../../../models/controller.js');
const EventEmitter = require('events');
const expect = require('chai').expect;
const machineModel = require('../../../models/machine.js');

//Data
const key1 = 'at592VFeO0ogmSOalVNHGTpw8TcXpZFgySWVTlHYhLIqHQbMO2fh63HihfSd8Zgx53WS6G2NbSX5sLUeNCJPN3evPePTGCI9YgbzwGWiEJg0M25mCGIfPsbrXN0qTGQO4sbgZWJQGEExKZttXCgOwY47Lb42zCBB9RKXO9XnO6DJcx6YRuRhVSS7wcxMp5rBOGZ4li2Zl2gM30upbZstzfTh06SHwE2HIut30FAgjA572xzvFtkyqP0kgcfuM9A0GEDJaVNFYAgd08FczeAyB3jn61nR5INn80td5nm3jMToIsVMwjonojL9ytYV1yh4eu0Xje7xppBP51AZKayscFsOaFp4VHuocfKSdcAGsDPqEXZxUBGGQTZvCnrLIrdIseuYKLR7CdDFUaeLqz3B9Hl600I5gvmFKfmW8KywKxlJQhEWwPEpSOTxS4N6y6T9MRGRq5pX12h2eVYSHrKgP9ReBOBha1WEd7o9akw2RhMHuzohOpoY1EHUnCbWa6MD';
let controller;
let machine;

//Export
module.exports = () =>
{
  before(async () =>
  {
    //Create controller
    controller = new controllerModel({
      name: 'abc',
      key: key1
    });

    await controller.save();

    //Create machine
    machine = new machineModel({
      controller: controller._id,
      name: 'def',
      length: 10,
      width: 10,
      height: 10
    });

    await machine.save();
  });

  it('should join the socket to the correct rooms', done =>
  {
    //Mock socket
    const socket = new EventEmitter();

    //Mock room
    socket.join = rooms =>
    {
      expect(rooms).to.eql([machine._id.toJSON()]);
      done();
    };

    //Mock handshake
    socket.handshake = {
      address: 'TESTING-IP',
      auth: {
        _id: controller._id.toJSON()
      }
    };

    //Mock connection
    connection(socket);
  });

  //Cleanup
  after(async () =>
  {
    await machine.remove();
    await controller.remove();
  });
};
/**
 * @fileoverview Socket connection tests
 */

//Imports
const accountModel = require('../../../models/account.js');
const app = require('../../../../app.js');
const chai = require('chai');
const config = require('config');
const controllerModel = require('../../../models/controller.js');
const expect = require('chai').expect;
const fileModel = require('../../../models/file.js');
const fs = require('fs').promises;
const io = require('socket.io-client');
const machineModel = require('../../../models/machine.js');
const path = require('path');

//Get address
const address = `https://127.0.0.1:${config.get('core.server.port')}`;

//Agent
const agent = chai.request.agent(app);

//Data
const key = 'at592VFeO0ogmSOalVNHGTpw8TcXpZFgySWVTlHYhLIqHQbMO2fh63HihfSd8Zgx53WS6G2NbSX5sLUeNCJPN3evPePTGCI9YgbzwGWiEJg0M25mCGIfPsbrXN0qTGQO4sbgZWJQGEExKZttXCgOwY47Lb42zCBB9RKXO9XnO6DJcx6YRuRhVSS7wcxMp5rBOGZ4li2Zl2gM30upbZstzfTh06SHwE2HIut30FAgjA572xzvFtkyqP0kgcfuM9A0GEDJaVNFYAgd08FczeAyB3jn61nR5INn80td5nm3jMToIsVMwjonojL9ytYV1yh4eu0Xje7xppBP51AZKayscFsOaFp4VHuocfKSdcAGsDPqEXZxUBGGQTZvCnrLIrdIseuYKLR7CdDFUaeLqz3B9Hl600I5gvmFKfmW8KywKxlJQhEWwPEpSOTxS4N6y6T9MRGRq5pX12h2eVYSHrKgP9ReBOBha1WEd7o9akw2RhMHuzohOpoY1EHUnCbWa6MD';
let account;
let controller;
let file;
let socket;

//Export
module.exports = () =>
{
  before(async () =>
  {
    //Create account
    account = new accountModel({
      role: 'admin',
      username: 'abc',
      hash: '$argon2id$v=19$m=65536,t=3,p=12$dMaFGvt1Bq3utN1FSQS3Ag$PIArM+hQPWCgM1xnUUvIqX8fK03A37mmLuSo7AoyK6I',
      mfa: false
    });

    await account.save();

    //Create controller
    controller = new controllerModel({
      name: 'abc',
      key: 'at592VFeO0ogmSOalVNHGTpw8TcXpZFgySWVTlHYhLIqHQbMO2fh63HihfSd8Zgx53WS6G2NbSX5sLUeNCJPN3evPePTGCI9YgbzwGWiEJg0M25mCGIfPsbrXN0qTGQO4sbgZWJQGEExKZttXCgOwY47Lb42zCBB9RKXO9XnO6DJcx6YRuRhVSS7wcxMp5rBOGZ4li2Zl2gM30upbZstzfTh06SHwE2HIut30FAgjA572xzvFtkyqP0kgcfuM9A0GEDJaVNFYAgd08FczeAyB3jn61nR5INn80td5nm3jMToIsVMwjonojL9ytYV1yh4eu0Xje7xppBP51AZKayscFsOaFp4VHuocfKSdcAGsDPqEXZxUBGGQTZvCnrLIrdIseuYKLR7CdDFUaeLqz3B9Hl600I5gvmFKfmW8KywKxlJQhEWwPEpSOTxS4N6y6T9MRGRq5pX12h2eVYSHrKgP9ReBOBha1WEd7o9akw2RhMHuzohOpoY1EHUnCbWa6MD'
    });

    await controller.save();

    //Create machine
    machine = new machineModel({
      controller: controller._id.toJSON(),
      name: 'abc',
      tags: [],
      length: 1,
      width: 1,
      height: 1
    });

    await machine.save();

    //Create file
    file = new fileModel({
      owner: account._id,
      name: 'abc',
      description: 'def',
      extension: 'ghi'
    });

    await file.save();

    await fs.writeFile(`${path.join(config.get('core.data.filesystem'), file._id.toJSON())}.raw`, ';TEST FILE');

    //Login
    await agent
      .post('/api/sessions/login')
      .send({
        username: 'abc',
        password: 'Testingpassword123!'
      });

    //Bind controller
    socket = io.connect(address, {
      auth: {
        _id: controller._id.toJSON(),
        key: key
      },
      rejectUnauthorized: !config.get('core.cryptography.selfSigned')
    });

    //Register connection handlers
    await new Promise((resolve, reject) =>
    {
      socket.once('connect', resolve);
      socket.once('connect_error', reject);
    });
  });

  it('should command machine and return machine response', async () =>
  {
    //Emulate controller
    socket.once('command', data =>
    {
      expect(data).to.haveOwnProperty('payload', ';TEST COMMAND');

      socket.emit('output', {
        machine: data.machine,
        payload: 'TEST COMMAND RESPONSE'
      });
    });

    //Send command
    const res = await agent
      .post(`/api/machines/${machine._id}/command`)
      .send({command: ';TEST COMMAND'});

    expect(res.body).to.eql({response: 'TEST COMMAND RESPONSE'});
  });

  it('should execute file on machine and return machine response', async () =>
  {
    //Emulate controller
    socket.once('execute', data =>
    {
      expect(data).to.haveOwnProperty('payload', ';TEST FILE');

      socket.emit('output', {
        machine: data.machine,
        payload: true
      });
    });

    //Execute file
    const res = await agent
      .post(`/api/machines/${machine._id}/execute`)
      .send({file: file._id});

    expect(res.body).to.eql({response: true});
  });

  it('shouldn\'t crash when commanding a machine attached to a disconnected controller', async () =>
  {
    //Close
    socket.close();

    //Send command
    const res = await agent
      .post(`/api/machines/${machine._id}/command`)
      .send({command: ';TEST COMMAND'});

    expect(res.body).to.eql({
      error: {
        name: 'Disconnected Controller',
        description: 'The machine you\'re trying to contact is attached to a controller that isn\'t connected!'
      }
    });
  });

  it('shouldn\'t crash when executing file on disconnected controller', async () =>
  {
    //Execute file
    const res = await agent
      .post(`/api/machines/${machine._id}/execute`)
      .send({file: file._id});

    expect(res.body).to.eql({
      error: {
        name: 'Disconnected Controller',
        description: 'The machine you\'re trying to contact is attached to a controller that isn\'t connected!'
      }
    });
  });

  //Cleanup and logout
  after(async () =>
  {
    await controller.remove();
    await account.remove();
    await machine.remove();
    await file.remove();
    await fs.unlink(`${path.join(config.get('core.data.filesystem'), file._id.toJSON())}.raw`);
    await agent
      .post('/api/sessions/logout')
      .send();
  });
};
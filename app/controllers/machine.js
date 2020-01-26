/**
 * @fileoverview Machine controller
 */

//Imports
const config = require('../../config.js');
const controller = require('../models/controller.js');
const create = require('../lib/create.js');
const fs = require('fs').promises;
const model = require('../models/machine.js');
const mongoose = require('mongoose');
const path = require('path');
const store = require('../websocket/store.js');
const update = require('../lib/update.js');

//Logic
module.exports = {
  getAll: async function (req, res)
  {
    //Get all documents
    let docs = await model.find().exec();

    //Populate controller
    docs = await docs.map(async doc => (await doc.populate('controller').execPopulate()).toJSON());

    //Each element is a document resolving promise, resolve each one
    docs = await Promise.all(docs);

    return res.json(docs);
  },
  create: async function (req, res)
  {
    const constructor = create(req.body, {
      controller: value => mongoose.Types.ObjectId.isValid(value),
      name: config.filters.name,
      tags: config.filters.tags,
      length: value => typeof value == 'number',
      width: value => typeof value == 'number',
      height: value => typeof value == 'number'
    }, res);

    if (constructor != null)
    {
      //Ensure controller exists
      const controllerDoc = await controller.findById(constructor.controller);
      if (controllerDoc == null)
      {
        return res.status(422).json({
          error: {
            name: 'Unrecognized Controller',
            description: 'The specified controller doesn\'t exist!'
          }
        });
      }
      else
      {
        constructor.controller = new mongoose.Types.ObjectId(constructor.controller);
        const doc = new model(constructor);

        await doc.save();
        return res.json({_id: doc.id, controller: controllerDoc.toJSON()});
      }
    }
  },
  get: function (req, res)
  {
    return res.json(req.machine.toJSON());
  },
  command: function (req, res)
  {
    //Get socket
    const socket = store.get(req.machine.controller.id);

    //Disconnected controller
    if (socket == null)
    {
      return res.json({
        error: {
          name: 'Disconnected Controller',
          description: 'The machine you\'re trying to command is attached to a controller that isn\'t connected!'
        }
      });
    }

    //Generate conversation ID
    const id = new mongoose.Types.ObjectId();

    //Register response
    socket.on('response:command', message =>
    {
      if (message._id == id)
      {
        return res.json({response: message.response});
      }
    });

    //Send command
    socket.send(JSON.stringify({
      _id: id,
      event: 'command',
      machine: req.machine._id,
      command: req.body.command
    }));
  },
  execute: async function (req, res)
  {
    //Get socket
    const socket = store.get(req.machine.controller.id);

    //Disconnected controller
    if (socket == null)
    {
      return res.json({
        error: {
          name: 'Disconnected Controller',
          description: 'The machine you\'re trying to execute a file on is attached to a controller that isn\'t connected!'
        }
      });
    }

    //Generate conversation ID
    const id = new mongoose.Types.ObjectId();

    //Register response
    socket.on('response:execute', message =>
    {
      if (message._id == id)
      {
        return res.json({success: message.success});
      }
    });

    //Get file
    const file = await fs.readFile(`${path.join(config.data.filesystem, req.body.file)}.gcode`, 'utf8');

    //Send file
    socket.send(JSON.stringify({
      _id: id,
      event: 'execute',
      machine: req.machine._id,
      file
    }));
  },
  update: async function (req, res)
  {
    const success = update(req.body, req.machine, {
      controller: value => mongoose.Types.ObjectId.isValid(value),
      name: config.filters.name,
      tags: config.filters.tags,
      length: value => typeof value == 'number',
      width: value => typeof value == 'number',
      height: value => typeof value == 'number'
    }, res);

    if (success)
    {
      //Update controller
      if (req.body.controller != null)
      {
        req.machine.controller = new mongoose.Types.ObjectId(req.body.controller);
      }
      else
      {
        req.machine.controller = req.machine.controller._id;
      }

      await req.machine.save();
      return res.end();
    }
  },
  delete: async function (req, res)
  {
    await req.machine.remove();
    return res.end();
  }
};
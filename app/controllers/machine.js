/**
 * @fileoverview Machine Controller
 */

//Imports
const config = require('../../config');
const controller = require('../models/controller');
const fs = require('fs').promises;
const model = require('../models/machine');
const websocket = require('./websocket');

//Export
module.exports = {
  /**
   * Get all machines
   * @returns {Promise<Array<{controller: String, name: String, tags: Array<String>, length: Number, width: Number, height: Number}>>}
   */
  all: async () =>
  {
    const docs = await model.find(null);
    return docs.map(doc => doc.toJSON());
  },
  /**
   * Create a machine
   * @param {String} _controller Machine controller ID
   * @param {String} name Machine name
   * @param {Array<String>} tags Machine tags
   * @param {Number} length Machine working area length
   * @param {Number} width Machine working area width
   * @param {Number} height Machine working area height
   * @returns {Promise<{error: {name: String, description: String}}>|Promise<{_id: String}>}
   */
  create: async (_controller, name, tags, length, width, height) =>
  {
    //Verify controller
    if (await controller.findById(_controller) == null)
    {
      return Promise.reject({
        error: {
          name: 'Invalid Controller',
          description: 'The machine you\'re trying to create belongs to an invalid controller.'
        }
      });
    }
    else
    {
      const doc = new model({
        name,
        tags,
        length,
        width,
        height
      });

      await doc.save();
      return {_id: doc._id};
    }
  },
  /**
   * Send a command to a machine by ID
   * @param {String} _id Machine ID
   * @param {String} command GCODE Command
   * @returns {String} Machine response
   */
  command: async (_id, command) =>
  {
    //Get machine controller
    const _controller = await model.findById(_id);

    //Send command
    const response = await websocket(_controller.controller, {
      event: 'command',
      machine: _id,
      command
    });

    return response.response;
  },
  /**
  * Send a file to a machine by ID
  * @param {String} _id Machine ID
  * @param {String} file File ID
  * @returns {Boolean} Machine success
  */
  execute: async (_id, file) =>
  {
    //Get machine controller
    const _controller = await model.findById(_id);

    //Get file
    const _file = await fs.readFile(path.join(config.data.filesystem, doc._id) + '.gcode', 'utf8');

    //Send command
    const response = await websocket(_controller.controller, {
      event: 'execute',
      machine: _id,
      file: _file
    });

    return response.success;
  },
  /**
   * Get a machine by its ID
   * @param {String} _id Machine ID
   * @returns {Promise<{controller: String, name: String, tags: Array<String>, length: Number, width: Number, height: Number}>}
   */
  get: async _id =>
  {
    const doc = await model.findById(_id);
    return doc.toJSON();
  },
  /**
   * Update a machine by its ID
   * @param {String} _id Machine Id
   * @param {Object} data Data to update machine with
   * @returns {Promise<void>|Promise<{error: {name: String, description: String}}>}
   */
  update: async (_id, data) =>
  {
    //Verify controller
    if (data.controller != null && await controller.findById(data.controller) == null)
    {
      return Promise.reject({
        error: {
          name: 'Invalid Controller',
          description: 'The machine you\'re trying to create belongs to an invalid controller.'
        }
      });
    }
    else
    {
      await model.findByIdAndUpdate(_id, data);
    }
  },
  /**
   * Remove a machine by its ID
   * @param {String} _id
   * @returns {Promise<void>}
   */
  remove: async _id =>
  {
    await model.findByIdAndDelete(_id);
  }
};
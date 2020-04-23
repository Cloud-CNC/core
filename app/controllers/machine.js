/**
 * @fileoverview Machine Controller
 */

//Imports
const config = require('config');
const controller = require('../models/controller');
const file = require('../models/file');
const fs = require('fs').promises;
const model = require('../models/machine');
const path = require('path');
const websocket = require('./websocket');

//Export
module.exports = {
  /**
   * Get all machines
   * @returns {Promise<Array<{controller: String, name: String, tags: Array<String>, length: Number, width: Number, height: Number}>>}
   */
  all: async () =>
  {
    const docs = await model.find();
    return docs.map(doc => doc.toJSON());
  },
  /**
   * Create a machine
   * @param {String} _controller Controller ID
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
      return {
        error: {
          name: 'Invalid Controller',
          description: 'The machine you\'re trying to create belongs to an invalid controller!'
        }
      };
    }
    else
    {
      const doc = new model({
        controller: _controller,
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
   * @returns {Promise<String>|Promise<{error: {name: String, description: String}}>} Machine response
   */
  command: async (_id, command) =>
  {
    //Send command
    try
    {
      const response = await websocket(_id, {
        event: 'command',
        command
      });

      return {response: response.response};
    }
    catch (error)
    {
      return error;
    }
  },
  /**
  * Send a file to a machine by ID
  * @param {String} _id Machine ID
  * @param {String} _file File ID
  * @returns {Promise<Boolean>} Machine success
  */
  execute: async (_id, _file) =>
  {
    //Verify file
    if (await file.findById(_file) == null)
    {
      return {
        error: {
          name: 'Invalid File',
          description: 'The file you\'re trying to execute doesn\'t exist!'
        }
      };
    }
    else
    {
      //Get file
      const raw = await fs.readFile(path.join(config.get('core.data.filesystem'), _file) + '.gcode', 'utf8');

      //Send command
      try
      {
        const response = await websocket(_id, {
          event: 'execute',
          file: raw
        });
        
        return {success: response.success};
      }
      catch (error)
      {
        return error;
      }
    }
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
      return {
        error: {
          name: 'Invalid Controller',
          description: 'The machine you\'re trying to create belongs to an invalid controller!'
        }
      };
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
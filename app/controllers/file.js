/**
 * @fileoverview File Controller
 */

//Imports
const account = require('../models/account');
const config = require('../../config');
const fs = require('fs').promises;
const model = require('../models/file');
const path = require('path');

//Export
module.exports = {
  /**
   * Get all non-trashed files owned by an account
   * @param {String} owner Account owner ID
   * @returns {Promise<Array<{name: String, description: String}>>}
   */
  all: async owner =>
  {
    const docs = await model.find({owner, status: 0}, ['name', 'description']);
    return docs.map(doc => doc.toJSON());
  },
  /**
   * Create a file
   * @param {String} owner Account owner ID
   * @param {String} name File name
   * @param {String} description File description
   * @param {String} raw File (Not binary)
   * @returns {Promise<{error: {name: String, description: String}}>|Promise<{_id: String}>}
   */
  create: async (owner, name, description, raw) =>
  {
    //Verify owner
    if (await account.findById(owner) == null)
    {
      return {
        error: {
          name: 'Invalid Account',
          description: 'The file you\'re trying to create belongs to an invalid account!'
        }
      };
    }
    else
    {
      const doc = new model({
        owner,
        name,
        description
      });

      await doc.save();

      //Write to disk
      await fs.writeFile(path.join(config.data.filesystem, doc.id) + '.gcode', raw);

      return {_id: doc._id};
    }
  },
  /**
   * Get a file by its ID
   * @param {String} _id File ID
   * @returns {Promise<{name: String, description: String, raw: String}>}
   */
  get: async _id =>
  {
    const doc = await model.findById(_id, ['name', 'description']);

    //Get from disk
    const raw = await fs.readFile(path.join(config.data.filesystem, _id) + '.gcode', 'utf8');

    return {...doc.toJSON(), raw};
  },
  /**
   * Update a file by its ID
   * @param {String} _id File ID
   * @param {Object} data Data to update file with
   * @returns {Promise<void>}
   */
  update: async (_id, data) =>
  {
    await model.findByIdAndUpdate(_id, data);
  },
  /**
   * Remove a file by its ID (Move to trash)
   * @param {String} _id File ID
   */
  remove: async _id =>
  {
    await model.findByIdAndUpdate(_id, {status: 1});
  }
};
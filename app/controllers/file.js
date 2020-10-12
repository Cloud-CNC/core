/**
 * @fileoverview File Controller
 */

//Imports
const account = require('../models/account');
const config = require('config');
const fs = require('fs').promises;
const model = require('../models/file');
const path = require('path');

//Export
module.exports = {
  /**
   * Get all non-trashed files owned by an account
   * @param {String} owner Account owner ID
   * @returns {Promise<Array<{name: String, description: String, extension: String}>>}
   */
  all: async owner =>
  {
    const docs = await model.find({owner, status: 0}, ['name', 'description', 'extension']);
    return docs.map(doc => doc.toJSON());
  },
  /**
   * Create a file
   * @param {String} owner Account owner ID
   * @param {String} name File name
   * @param {String} description File description
   * @param {String} temp Path of the temporary file
   * @param {String} extension The file extension
   * @returns {Promise<{error: {name: String, description: String}}>|Promise<{_id: String}>}
   */
  create: async (owner, name, description, temp, extension) =>
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
        description,
        extension
      });

      await doc.save();

      //Move to persistante storage
      await fs.rename(temp, path.join(config.get('core.data.filesystem'), doc.id) + '.raw');

      return {_id: doc._id};
    }
  },
  /**
   * Get a file's metadata by its ID
   * @param {String} _id File ID
   * @returns {Promise<{name: String, description: String, extension: String}>}
   */
  get: async _id =>
  {
    const doc = await model.findById(_id, ['name', 'description', 'extension']);
    return doc.toJSON();
  },
  /**
   * Get a file name by its ID
   * @param {String} _id File ID
   * @returns {Promise<String>}
   */
  raw: _id =>
  {
    //Generate file name
    const name = path.resolve(path.join(config.get('core.data.filesystem'), _id) + '.raw');

    return name;
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
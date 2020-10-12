/**
 * @fileoverview Trash Controller
 */

//Imports
const config = require('config');
const fs = require('fs').promises;
const model = require('../models/file');
const path = require('path');

//Export
module.exports = {
  /**
   * Get all trashed files owned by an account
   * @param {String} owner Account owner ID
   * @returns {Promise<Array<{name: String, description: String, extension: String}>>}
   */
  all: async owner =>
  {
    const docs = await model.find({owner, status: 1}, ['name', 'description', 'extension']);
    return docs.map(doc => doc.toJSON());
  },
  /**
   * Recover a file by ID
   * @param {String} _id File ID
   * @returns {Promise<void>}
   */
  recover: async _id =>
  {
    await model.findByIdAndUpdate(_id, {status: 0});
  },
  /**
   * Remove a file by its ID (Permanently delete)
   * @param {String} _id File ID
   * @returns {Promise<void>}
   */
  remove: async _id =>
  {
    //Remove from disk
    await fs.unlink(path.join(config.get('core.data.filesystem'), _id) + '.raw');

    await model.findByIdAndDelete(_id);
  }
};
/**
 * @fileoverview "Controller" Controller
 */

//Imports
const crypto = require('crypto');
const machine = require('../models/machine');
const model = require('../models/controller');

//Export
module.exports = {
  /**
   * Get all controllers
   * @returns {Promise<Array<{name: String}>>}
   */
  all: async () =>
  {
    const docs = await model.find(null);
    return docs.map(doc => doc.toJSON());
  },
  /**
   * Create a controller
   * @param {String} name Controller name
   * @returns {Promise<{_id: String, key: String}>}
   */
  create: async name =>
  {
    //Generate key
    const key = crypto.randomBytes(512).toString('base64');

    const doc = new model({
      name,
      key
    });

    await doc.save();
    return {_id: doc._id, key};
  },
  /**
   * Get a controller by its ID
   * @param {String} _id Controller ID
   * @returns {Promise<{name: String}>}
   */
  get: async _id =>
  {
    const doc = await model.findById(_id);
    return doc.toJSON();
  },
  /**
   * Update a controller by its ID
   * @param {String} _id Controller ID
   * @param {Object} data Data to update controller with
   * @returns {Promise<Void>}
   */
  update: async (_id, data) =>
  {
    await model.findByIdAndUpdate(_id, data);
  },
  /**
   * Remove a controller by its ID
   * @param {String} _id Controller ID
   * @returns {Promise<void|{error: {name: String, description: String}}>}
   */
  remove: async _id =>
  {
    const machines = await machine.find({controller: _id});

    if (machines.length > 0)
    {
      return {
        error: {
          name: 'Child Machines',
          description: 'The controller you\'re trying to remove still owns machine(s). Please remove them before retrying!'
        }
      };
    }
    else
    {
      await model.findByIdAndDelete(_id);
    }
  }
};
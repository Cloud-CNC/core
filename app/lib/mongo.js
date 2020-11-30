/**
 * @fileoverview Bootstrap MongoDB
 */

//Imports
const config = require('config');
const logger = require('./logger.js');
const mongoose = require('mongoose');

//Exports
module.exports = {
  /**
   * Connect to/get the MongoDB connection
   * @returns {typeof import("mongoose")}
   */
  connect: () =>
  {
    //If not connected, connect
    if (mongoose.connection.readyState == mongoose.STATES.disconnected)
    {
      //Get the database URI
      const database = config.get('core.data.mongodb');

      //Register events
      mongoose.connection.on('connected', () =>
      {
        logger.info(`Connected to MongoDB at ${database}`);
      });

      mongoose.connection.on('error', err =>
      {
        logger.info(`MongoDB error ${err}`);
      });

      mongoose.connection.on('disconnected', () =>
      {
        logger.info(`Disconnected from MongoDB at ${database}`);
      });

      //Connect to the database
      mongoose.connect(database, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    return mongoose;
  }
};
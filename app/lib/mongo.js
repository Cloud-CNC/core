/**
 * @fileoverview Mongodb connection
 */

//Imports
const {database} = require('../../config.js').data;
const logger = require('./logger.js');
const mongoose = require('mongoose');

/**
 * Mongodb connection
 * @returns {Promise<typeof import("mongoose")>} Returns Mongoose import
 */
module.exports = () =>
{
  //Register events
  mongoose.connection.on('connected', () =>
  {
    logger.info(`Mongoose connected to ${database}`);
  });
  mongoose.connection.on('error', err =>
  {
    logger.info(`Mongoose error ${err} when connected to ${database}`);
  });
  mongoose.connection.on('disconnected', () =>
  {
    logger.info(`Mongoose disconnected from ${database}`);
  });
  process.once('exit', () =>
  {
    mongoose.connection.close();
    logger.info(`Mongoose disconnected from ${database} due to application shutdown`);
  });

  //Connect to database
  return mongoose.connect(database, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};
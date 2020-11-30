/**
 * Bootstrap RedisDB
 */

//Imports
const config = require('config');
const logger = require('./logger');
const redis = require('redis');

//Instance variables
/**
 * The RedisDB client
 * @type {redis.RedisClient}
 */
let client;

//Exports
module.exports = {
  /**
   * Safely get the client
   * @returns {redis.RedisClient}
   */
  get client()
  {
    //If Redis isn't initialized (connected), error out
    if (client == null)
    {
      throw new Error('Accessing RedisDB before initialization!');
    }
    else
    {
      return client;
    }
  },
  /**
   * Connect to Redis
   * @returns {redis.RedisClient}
   */
  connect: () =>
  {
    //If not connected, connect
    if (client == null)
    {
      //Get the database URI
      const database = config.get('core.data.redisdb');

      //Connect to the database
      client = redis.createClient(database);

      //Register events
      client.on('connect', () =>
      {
        logger.info(`Connected to RedisDB at ${database}`);
      });

      client.on('error', err =>
      {
        logger.info(`RedisDB error ${err}`);
      });

      client.on('end', () =>
      {
        logger.info(`Disconnected from RedisDB at ${database}`);
      });
    }

    return client;
  }
};
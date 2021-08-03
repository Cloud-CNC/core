/**
 * @fileoverview Redis factory helper
 */

//Imports
import {RedisClient} from 'redis';
import {redisUrl} from './config';
import log from './log';

//Export
export default () =>
{
  //Ensure the URL was defined
  if (redisUrl == null)
  {
    //Log
    log.fatal('Cannot connect to Redis! (Redis URL wasn\'t provided)');

    //Crash
    process.exit(1);
  }

  //Setup the client
  const client = new RedisClient({
    url: redisUrl
  });

  return client;
};
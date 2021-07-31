/**
 * @fileoverview Redis factory helper
 */

//Imports
import {RedisClient} from 'redis';
import {redisUrl} from './config';

//Export
export default () =>
{
  //Setup the client
  const client = new RedisClient({
    url: redisUrl
  });

  return client;
};
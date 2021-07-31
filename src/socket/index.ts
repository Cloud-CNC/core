/**
 * @fileoverview SocketIO server
 */

//Imports
import {Server} from 'net';
import {Server as SocketServer} from 'socket.io';
import {createAdapter} from '@socket.io/redis-adapter';
import {redisUrl} from '../lib/config';
import redis from '../lib/redis';

/**
 * SocketIO server implementation
 */
export default (server: Server) =>
{
  //Setup the server
  const io = new SocketServer(server as any, {
    serveClient: false
  });

  //Register adapter
  if (redisUrl != null)
  {
    //Setup the adapter
    const adapter = createAdapter(redis(), redis());

    //Register the adapter
    io.adapter(adapter);
  }

  io.on('connection', () =>
  {
    console.log('Connected!');
  });

  return io;
};
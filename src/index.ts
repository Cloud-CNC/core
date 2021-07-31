/**
 * @fileoverview Main app file
 */

//Imports
import Koa from 'koa';
import generateServer from './lib/server';
import log from './lib/log';
import middleware from './middleware';
import mongoose from './lib/mongoose';
import plugin from './lib/plugin';
import socket from './socket';
import {debug, http} from './lib/config';

const main = async () =>
{
  //Koa setup
  const app = new Koa();
  app.use(middleware);

  //Generate the server
  const server = generateServer(app.callback());

  //SocketIO setup
  const io = socket(server);

  //Apply plugins
  await plugin(app, io);

  //Connect to Mongo
  await mongoose();

  //Start the server
  server.listen(http.port);

  //Log
  log.info(`Started Cloud CNC core on port ${http.port}. Running in ${debug ? 'debug' : 'production'} mode.`);
};

main();
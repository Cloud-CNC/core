/**
 * @fileoverview Main app file
 */

//Imports
import Koa from 'koa';
import generateServer from './server';
import log from './log';
import middleware from './middleware';
import socket from './socket';
import {debug, http} from './config';

//Generate the server
const server = generateServer();

//Koa setup
const app = new Koa();
app.use(middleware);

//SocketIO setup
socket(server);

//Start the server
server.listen(http.port);

//Log
log.info(`Started Cloud CNC core on port ${http.port}. Running in ${debug ? 'debug' : 'production'} mode.`);
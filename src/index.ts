/**
 * @fileoverview Main app file
 */

//Imports
import Koa from 'koa';
import log from './log';
import middleware from './middleware';
import {debug, port} from './config';

//Koa setup
const app = new Koa();

app.use(middleware);

//Start server
app.listen(port);

//Log
log.info(`Started Cloud CNC core on port ${port}. Running in ${debug ? 'debug' : 'production'} mode.`);
/**
 * @fileoverview App log
 */

//Imports
import pino from 'pino';
import {debug, pretty} from './config';

//Setup the log
const log = pino({
  formatters: {
    level: label => ({level: label})
  },
  level: debug ? 'debug' : 'info',
  prettyPrint: pretty
});

//Export
export default log;
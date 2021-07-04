/**
 * @fileoverview App log
 * 
 * This file cannot use the config (due to a dependency loop) but should still
 * follow it's principles
 */

//Imports
import 'dotenv/config';
import pino from 'pino';

//Setup the log
const log = pino({
  formatters: {
    level: label => ({level: label})
  },
  level: process.env.NODE_ENV == 'development' ? 'debug' : 'info',
  prettyPrint: !!process.env.PRETTY
});

//Export
export default log;
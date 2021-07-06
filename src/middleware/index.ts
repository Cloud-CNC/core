/**
 * @fileoverview App middleware
 */

//Imports
import compose from 'koa-compose';
import auth from './auth';
import body from './body';
import helmet from './helmet';
import logger from './logger';

//Compose middleware
const middleware = compose([
  helmet,
  logger,
  auth,
  body
]);

//Export
export default middleware;
/**
 * @fileoverview App middleware
 */

//Imports
import compose from 'koa-compose';
import auth from './auth';
import body from './body';
import helmet from './helmet';
import logger from './logger';
import sanitize from './sanitize';

//Compose middleware
const middleware = compose([
  helmet,
  logger,
  auth,
  body,
  sanitize
]);

//Export
export default middleware;
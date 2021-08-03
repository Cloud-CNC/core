/**
 * @fileoverview App middleware
 */

//Imports
import compose from 'koa-compose';
import authentication from './authentication';
//import authorization from './authorization';
import body from './body';
import helmet from './helmet';
import logger from './logger';
import sanitize from './sanitize';

//Compose middleware
const middleware = compose([
  helmet,
  logger,
  authentication,
//  authorization,
  body,
  sanitize
]);

//Export
export default middleware;
/**
 * @fileoverview Body parser middleware
 */

//Imports
import bodyParser from 'koa-bodyparser';

//Middleware
const middleware = bodyParser({
  enableTypes: [
    'json'
  ]
});

//Export
export default middleware;
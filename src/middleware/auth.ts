/**
 * @fileoverview Authentication and authorization middleware
 */

//Imports
import jwt from 'koa-jwt';
import {auth} from '../config';

//Middleware
const middleware = jwt({
  algorithms: [
    'HS512'
  ],
  secret: auth.secret
});

//Export
export default middleware;
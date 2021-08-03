/**
 * @fileoverview Authentication middleware
 */

//Imports
import jwt from 'koa-jwt';
import {auth} from '../lib/config';

//Middleware
const middleware = jwt({
  algorithms: [
    'HS512'
  ],
  cookie: 'jwt',
  secret: auth.secret
}).unless({
  path: /^\/sessions\/login\//
});

//Export
export default middleware;
/**
 * @fileoverview MongoDB sanitization middleware
 */

//Imports
import {Context, Next} from 'koa';
import {sanitize} from 'mongodb-sanitize';

//Middleware
const middleware = async (ctx: Context, next: Next) =>
{
  //Sanitize the body
  if (ctx.request.body != null)
  {
    ctx.request.body = sanitize(ctx.request.body);
  }

  //Sanitize path parameters
  if (ctx.path != null)
  {
    ctx.path = sanitize(ctx.path);
  }

  //Sanitize query parameters
  if (ctx.query != null)
  {
    ctx.query = sanitize(ctx.query);
  }

  await next();
};

//Export
export default middleware;
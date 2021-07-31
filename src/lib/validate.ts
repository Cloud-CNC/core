/**
 * @fileoverview Validation middleware
 */

//Imports
import {Context} from 'koa';
import {Schema} from 'joi';

//Middleware
const validate = (schema: Schema, ctx: Context) =>
{
  //Validate the body
  const res = schema.validate(ctx.body);

  //Invalid requests
  if (res.error != null)
  {
    //Log
    ctx.log.error(res, 'Invalid request!');

    //Reject
    ctx.status = 400;
    throw res.error;
  }

  //Suspect requests
  if (res.warning != null)
  {
    ctx.log.warn(res, 'Suspect request!');
  }
};

//Export
export default validate;
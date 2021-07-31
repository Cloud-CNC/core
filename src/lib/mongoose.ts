/**
 * @fileoverview Mongoose connection helper
 */

//Imports
import {connect} from 'mongoose';
import {mongoUrl} from './config';

//Export
export default async () =>
{
  //Connect to Mongo
  await connect(mongoUrl!, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};
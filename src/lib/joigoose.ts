/**
 * @fileoverview Joigoose helper
 */

//Imports
import createJoigoose from 'joigoose';
import Mongoose from 'mongoose';

//Create the joigoose instance
const joigoose = createJoigoose(Mongoose);

//Export
export default joigoose;
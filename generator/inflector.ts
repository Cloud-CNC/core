/**
 * @fileoverview Inflector utility
 */

//Imports
import * as inflectorBase from 'inflected';

/**
 * Extended inflector
 */
export default {
  ...inflectorBase,
  camelize: (input: string) => inflectorBase.camelize(input, false),
  lowercase: (input: string) => input.toLowerCase()
};
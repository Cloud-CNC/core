/**
 * @fileoverview Handlebars utility
 */

//Imports
import {readFile} from 'fs/promises';
import {compile, registerHelper} from 'handlebars';
import * as inflectorBase from 'inflected';

/**
 * Prepare a template
 * @param path The template path
 * @returns The compiled template
 */
export const prepareTemplate = async (path: string) =>
{
  //Read the raw template
  const raw = await readFile(path, 'utf-8');

  //Compile the template
  const template = compile(raw);

  return template;
};

//Value equality helper
registerHelper('equals', (a: string, b: string) => a == b);

//Literal character helper
registerHelper('literal', (input: string) => input);

//Path parameter helper
registerHelper('parameter', (input: string) =>
{
  //Replace {name} with :name
  return input.replace(/{(.+)}/g, ':$1');
});

/**
 * Extended inflector
 */
const inflector = {
  ...inflectorBase,
  camelize: (input: string) => inflectorBase.camelize(input, false),
  lowercase: (input: string) => input.toLowerCase()
};

//Inflection helper
type inflectMethod = keyof typeof inflector;
registerHelper('inflect', (method: inflectMethod, input: string | number) =>
{
  if (!(method in inflector))
  {
    throw new Error(`Invalid inflect method ${method}!`);
  }

  //Cast the function
  const func = inflector[method] as (arg: string | number) => string;

  //Inflect
  const output = func(input);

  return output;
});
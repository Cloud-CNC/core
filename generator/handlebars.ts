/**
 * @fileoverview Handlebars utility
 */

//Imports
import {readFile} from 'fs/promises';
import * as inflectorBase from 'inflected';
import _ from 'lodash';
import {compile, HelperOptions, registerHelper, registerPartial} from 'handlebars';
import {Entity, Field, Parameter} from './restructure/types';

/**
 * Extended inflector
 */
const inflector = {
  ...inflectorBase,
  camelize: (input: string) => inflectorBase.camelize(input, false),
  lowercase: (input: string) => input.toLowerCase()
};

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

//List includes helper
registerHelper('includes', <T>(item: T, ...list: T[]) => list?.includes(item));

//Literal character helper
registerHelper('literal', (input: string) => input);

//Path parameter helper
registerHelper('parameter', (input: string) =>
{
  //Replace {name} with :name
  return input.replace(/{(.+)}/g, ':$1');
});

//Unique parameters helper
registerHelper('uniqueParameters', (options: HelperOptions) =>
{
  const parameters = [] as Parameter[];

  //Aggregate parameters
  for (const operation of (options.data.root as Entity).operations)
  {
    parameters.push(...operation.parameters);
  }

  //Return unique parameters
  return _.uniqWith(parameters, (a, b) =>
    a.name == b.name &&
    a.description == b.description
  );
});

//Unique fields helper
registerHelper('uniqueFields', (options: HelperOptions) =>
{
  const fields = [] as Field[];

  //Aggregate fields
  for (const operation of (options.data.root as Entity).operations)
  {
    fields.push(...operation.fields);
  }

  //Return unique fields
  return _.uniqWith(fields, (a, b) =>
    a.name == b.name &&
    a.description == b.description &&
    a.typescriptType == b.typescriptType &&
    a.joiType == b.joiType
  );
});

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

//Camelcase entity name partial
registerPartial('camelCaseEntity', '{{inflect "camelize" (inflect "singularize" @root.name)}}');

//Titlecase entity name partial
registerPartial('titleCaseEntity', '{{inflect "classify" (inflect "singularize" @root.name)}}');

//Lowercase entity name partial
registerPartial('lowerCaseEntity', '{{inflect "lowercase" (inflect "singularize" @root.name)}}');
/**
 * @fileoverview Restructure utilities
 */

//Imports
import {OpenAPIV3} from 'openapi-types';

/**
 * List of valid OAS3 methods
 */
export const methods = Object.values(OpenAPIV3.HttpMethods);

/**
 * Translate an OAS3 schema to a TypeScript type
 * @param schema OAS3 schema
 * @returns TypeScript type literal
 */
export const typescriptType = (schema: OpenAPIV3.SchemaObject): string =>
{
  //Enums
  if (schema.enum != null)
  {
    return schema.enum.map(value => `'${value}'`).join(' | ');
  }

  //Regular types
  switch (schema.type)
  {
    case 'array':
      //Cast items
      const items = schema.items as OpenAPIV3.SchemaObject;

      //Translate the item type
      const itemType = typescriptType(items);

      return `${itemType}[]`;

    case 'boolean':
      return 'boolean';

    case 'integer':
    case 'number':
      return 'number';

    case 'object':
      return 'object';

    case 'string':
      return 'string';

    default:
      throw new Error(`Cannot translate OAS3 type "${schema.type}"!`);
  }
};

/**
 * Translate an OAS3 schema to a Mongoose type
 * @param schema OAS3 schema
 * @returns Mongoose type literal
 */
 export const mongooseType = (schema: OpenAPIV3.SchemaObject): string =>
 {
   //Enums
   if (schema.enum != null)
   {
     return schema.enum.map(value => `'${value}'`).join(' | ');
   }
 
   //Regular types
   switch (schema.type)
   {
     case 'array':
       //Cast items
       const items = schema.items as OpenAPIV3.SchemaObject;
 
       //Translate the item type
       const itemType = typescriptType(items);
 
       return `Array<${itemType}>()`;
 
     case 'boolean':
       return 'Boolean';
 
     case 'integer':
     case 'number':
       return 'Number';
 
     case 'object':
       return 'Object';
 
     case 'string':
       return 'String';
 
     default:
       throw new Error(`Cannot translate OAS3 type "${schema.type}"!`);
   }
 };
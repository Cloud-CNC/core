/**
 * @fileoverview Restructure an OAS3 path
 */

//Imports
import _ from 'lodash';
import {OpenAPIV3} from 'openapi-types';
import {Field, Parameter, Operation, Method} from './types';
import {joiType, methods, typescriptType} from './utils';

/**
 * Restructure an OAS3 path into one or more operations
 * @param pathName OAS3 path name
 * @param path OAS3 path
 * @returns Operation
 */
export default (pathName: string, path: OpenAPIV3.PathItemObject): Operation[] =>
{
  //Operation data
  const operationParameters = [] as Parameter[];

  //Generate operations
  const operations = [] as Operation[];
  for (const [entryName, entry] of Object.entries(path))
  {
    //Generate parameters
    if (entryName == 'parameters')
    {
      //Cast
      const parameters = entry as OpenAPIV3.ParameterObject[];

      //Add the parameters
      for (const parameter of parameters)
      {
        operationParameters.push({
          name: parameter.name,
          description: parameter.description!
        });
      }
    }

    //Generate fields
    const operationFields = [] as Field[];
    if (methods.includes(entryName as OpenAPIV3.HttpMethods))
    {
      //Cast
      const endpoint = entry as OpenAPIV3.OperationObject;
      const body = endpoint.requestBody as OpenAPIV3.RequestBodyObject;

      if (body != null)
      {
        for (const content of Object.values(body.content))
        {
          //Cast
          const schema = content.schema as OpenAPIV3.SchemaObject;

          //Ensure the schema type is an object
          if (schema.type != 'object')
          {
            throw new Error('Only objects are supported!');
          }

          //Add fields
          for (const [propertyName, schemaProperty] of Object.entries(schema.properties!))
          {
            //Cast
            const property = schemaProperty as OpenAPIV3.SchemaObject;

            //Add the field
            operationFields.push({
              name: propertyName!,
              description: property.description!,
              joiType: joiType(property),
              typescriptType: typescriptType(property),
              required: schema.required?.includes(propertyName) || false
            });
          }
        }
      }

      //Append the operation
      operations.push({
        name: endpoint.operationId!,
        description: endpoint.summary!,
        type: (endpoint as Record<string, any>)['x-operation-type'],
        method: entryName as Method,
        path: pathName,
        parameters: operationParameters,
        fields: operationFields
      });
    }
  }

  return operations;
};
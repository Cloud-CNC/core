/**
 * @fileoverview Restructure an OAS3 path
 */

//Imports
import _ from 'lodash';
import {OpenAPIV3} from 'openapi-types';
import {Endpoint, Field, Method, Parameter, Route} from './types';
import {joiType, methods, typescriptType} from './utils';

/**
 * Restructure an OAS3 path into a route
 * @param path OAS3 path
 * @returns Route
 */
export default (pathName: string, path: OpenAPIV3.PathItemObject): Route =>
{
  //Route data
  const routeParameter = [] as Parameter[];
  const routeEndpoints = [] as Endpoint[];

  for (const [entryName, entry] of Object.entries(path))
  {
    //Path parameters
    if (entryName == 'parameters')
    {
      //Cast
      const parameters = entry as OpenAPIV3.ParameterObject[];

      //Add the parameters
      for (const parameter of parameters)
      {
        routeParameter.push({
          name: parameter.name,
          description: parameter.description!
        });
      }
    }

    //Endpoint
    if (methods.includes(entryName as OpenAPIV3.HttpMethods))
    {
      //Cast
      const endpoint = entry as OpenAPIV3.OperationObject;
      const body = endpoint.requestBody as OpenAPIV3.RequestBodyObject;

      //Get the request fields
      const fields = [] as Field[];

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
            fields.push({
              name: propertyName!,
              description: property.description!,
              joiType: joiType(property),
              typescriptType: typescriptType(property),
              required: schema.required?.includes(propertyName) || false
            });
          }
        }
      }

      //Add the endpoint
      routeEndpoints.push({
        name: endpoint.operationId!,
        type: (endpoint as Record<string, any>)['x-operation-type'],
        description: endpoint.summary!,
        path: pathName,
        method: entryName as Method,
        fields
      });
    }
  }

  return {
    endpoints: routeEndpoints,
    parameters: routeParameter
  };
};
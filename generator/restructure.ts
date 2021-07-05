/**
 * @fileoverview Restructure parsed OAS3
 */

//Imports
import {resolve} from 'path';
import {OpenAPIV3} from 'openapi-types';
import {Endpoint, Entity, Method, Parameter, Route} from './types';

//List of valid OAS3 methods
const methods = Object.values(OpenAPIV3.HttpMethods);

/**
 * Restructure a path into a route
 * @param path 
 * @returns 
 */
const restructurePath = (pathName: string, path: OpenAPIV3.PathItemObject): Route =>
{
  //Route data
  const routeParameter = [] as Parameter[];
  const routeEndpoints = [] as Endpoint[];

  for (const [entryName, entry] of Object.entries(path))
  {
    //Route parameters
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

      //Add the endpoint
      routeEndpoints.push({
        name: endpoint.operationId!,
        description: endpoint.summary!,
        path: pathName,
        method: entryName as Method
      });
    }
  }

  return {
    endpoints: routeEndpoints,
    parameters: routeParameter
  };
};

/**
 * Restructure parsed OAS3 into a more condensed structure
 * @returns The condensed structure
 */
export default (api: OpenAPIV3.Document) =>
{
  //Generate entities
  const entities: Entity[] = [];

  //Add entity metadata
  for (const tag of Object.values(api.tags!))
  {
    entities.push({
      file: {
        model: resolve(__dirname, '..', 'src', 'models', `${tag.name}.ts`),
        routes: resolve(__dirname, '..', 'src', 'api', `${tag.name}.ts`)
      },
      name: tag.name,
      description: tag.description!,
      routes: []
    });
  }

  //Add entity routes
  for (const [pathName, path] of Object.entries(api.paths) as [string, OpenAPIV3.PathItemObject][])
  {
    //Get the entity
    const entity = entities.find(
      //Find an operation with matching tags
      entity => methods.find(
        //Check if the entry is an operation and if it has the tag
        method => path[method] != null && path[method]!.tags!.includes(entity.name)
      ) != null
    );

    //Ensure the entity was found
    if (entity == null)
    {
      throw new Error('Failed to find entity for path! (Make sure to tag the path');
    }

    //Restructure the path
    const newRoute = restructurePath(pathName, path);

    //Attempt to get the existing route
    const existingRoute = entity.routes.find(
      //Verify every new route parameter exists in the existing route
      existingRoute => newRoute.parameters.every(
        //Find an existing route parameter that matches the current new one
        newParameter => existingRoute.parameters.find(
          existingParameter =>
            newParameter.name == existingParameter.name &&
            newParameter.description == existingParameter.description
        )
      )
    );

    //Add to existing route
    if (existingRoute != null)
    {
      existingRoute.endpoints.push(...newRoute.endpoints);
    }
    //Add new route
    else
    {
      entity.routes.push(newRoute);
    }
  }

  return entities;
};
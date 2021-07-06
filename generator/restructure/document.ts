/**
 * @fileoverview Restructure an OAS3 document
 */

//Imports
import {resolve} from 'path';
import _ from 'lodash';
import {OpenAPIV3} from 'openapi-types';
import restructurePath from './path';
import {Entity} from './types';
import {methods} from './utils';

/**
 * Restructure an OAS3 document into an entity array
 * @param document OAS3 document
 * @returns Entity array
 */
export default (document: OpenAPIV3.Document): Entity[] =>
{
  //Generate entities
  const entities: Entity[] = [];

  //Add entity metadata
  for (const tag of Object.values(document.tags!))
  {
    entities.push({
      file: {
        model: resolve(__dirname, '..', '..', 'src', 'models', `${tag.name}.ts`),
        routes: resolve(__dirname, '..', '..', 'src', 'api', `${tag.name}.ts`)
      },
      name: tag.name,
      description: tag.description!,
      routes: []
    });
  }

  //Add entity routes
  for (const [pathName, path] of Object.entries(document.paths) as [string, OpenAPIV3.PathItemObject][])
  {
    //Get the entity
    const entity = entities.find(entity =>
    {
      //Verify the entity's name is one of the path's tags
      for (const method of methods)
      {
        if (path[method] != null && path[method]!.tags!.includes(entity.name))
        {
          return true;
        }
      }

      return false;
    });

    //Ensure the entity was found
    if (entity == null)
    {
      throw new Error('Failed to find entity for path! (Make sure to tag the path');
    }

    //Restructure the path
    const newRoute = restructurePath(pathName, path);

    //Attempt to get the existing route
    const existingRoute = entity.routes.find(existingRoute =>
    {
      //Verify each new parameter is in the existing route
      for (const newParameter of newRoute.parameters)
      {
        if (!existingRoute.parameters.find(existingParameter => _.isEqual(newParameter, existingParameter)))
        {
          return false;
        }
      }

      return true;
    });

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
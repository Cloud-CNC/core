/**
 * @fileoverview Server boilerplate generator
 * 
 * This generator only supports a fraction of (Open API Specification V3) OAS3
 * but it's easy to modify
 */

//Imports
import './handlebars';
import {resolve} from 'path';
import {writeFile} from 'fs/promises';
import {OpenAPIV3} from 'openapi-types';
import {validate} from 'swagger-parser';
import restructure from './restructure';
import {prepareTemplate} from './handlebars';

const main = async () =>
{
  //Validate, parse, and combine the OAS3 definitions
  const api = await validate(resolve(__dirname, '..', 'api', 'openapi.yml'));

  //Restructure the data
  const entities = restructure(api as OpenAPIV3.Document);

  //Prepare templates
  const modelTemplate = await prepareTemplate(resolve(__dirname, 'model.hbs'));
  const routeTemplate = await prepareTemplate(resolve(__dirname, 'routes.hbs'));

  //Generate the entities
  for (const entity of entities)
  {
    //Render
    const model = modelTemplate(entity);
    const routes = routeTemplate(entity);

    //Save
    await writeFile(entity.file.model, model);
    await writeFile(entity.file.routes, routes);
  }
};

main();
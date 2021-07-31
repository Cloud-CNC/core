/**
 * @fileoverview Cloud CNC core-plugin support
 */

//Imports
import {resolve} from 'path';
import Koa from 'koa';
import jiti from 'jiti';
import {Server} from 'socket.io';
import * as config from '../config';
import joigoose from '../joigoose';
import log from '../log';
import redis from '../redis';
import getPlugins from './get-plugins';

//Export
export default async (app: Koa, io: Server) =>
{
  //Get the fully-qualified project base directory
  const base = resolve(__dirname, '..', '..', '..');

  //Get plugins
  const plugins = await getPlugins(base);

  //Iterate over plugins
  for (const plugin of plugins)
  {
    //Compute the main file
    const mainPath = resolve(plugin.directory, plugin.main);

    //Load the main file
    const main = jiti(plugin.directory, {
      requireCache: false
    })(mainPath);

    //Get the export
    const mainExport = main.default || main;

    //Execute the main file
    await mainExport({
      app,
      config,
      io,
      joigoose,
      log,
      redis
    });

    //Log
    log.info(`Loaded plugin ${plugin.name} (From ${plugin.directory}).`);
  }
};
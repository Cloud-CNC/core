/**
 * @fileoverview Get plugins
 */

//Imports
import {resolve} from 'path';
import readPackage from 'read-pkg';

/**
 * Cloud CNC core-plugin
 */
interface Plugin
{
  /**
   * Fully-qualified path to the plugin's directory
   */
  directory: string;

  /**
   * Plugin name
   */
  name: string;

  /**
   * Raw path to the plugin's main file
   */
  main: string;
}

//Export
export default async (root: string) =>
{
  //Read the package
  const rootPkg = await readPackage({
    cwd: root
  });

  //Ensure there are dependencies
  if (rootPkg.dependencies == null)
  {
    throw new Error('[Plugin Module] No package dependencies!');
  }

  //Filter dependencies
  const plugins = [] as Plugin[];

  for (const [key, value] of Object.entries(rootPkg.dependencies))
  {
    //Filter non-plugins
    if (key.startsWith('@cloud-cnc/plugin-') || key.startsWith('cloud-cnc-plugin-'))
    {
      //Compute the dependency directory
      const directory = value.startsWith('file:') ? resolve(root, value.substring(5)) : resolve(root, 'node_modules', key);

      //Read the dependency package
      const dependencyPkg = await readPackage({
        cwd: directory
      });

      //Validate the "cloud-cnc" field
      if (dependencyPkg['cloud-cnc'] == null || dependencyPkg['cloud-cnc'].core == null)
      {
        throw new Error(`[Plugin Module] Cloud CNC plugin ${key} has an invalid/missing "cloud-cnc" field!`);
      }

      //Convert to a plugin
      const plugin: Plugin = {
        directory,
        name: key,
        main: dependencyPkg['cloud-cnc'].core.main
      };

      //Add the plugin
      plugins.push(plugin);
    }
  }

  return plugins;
};
/**
 * @fileoverview Permissions Helpers
 */

//Imports
const config = require('config');

/**
 * Get all (inherited) permissions for a role name
 * @param {String} role 
 */
const getPermissions = name =>
{
  //Get ACL role
  role = config.get('core.acl.roles')[name];

  if (role == null)
  {
    return [];
  }

  //Add permissions
  const permissions = [];

  //Add direct permissions
  permissions.push(...role.rules);

  //Add inherited permissions (String)
  if (role.inherits != null && typeof role.inherits == 'string')
  {
    permissions.push(...getPermissions(role.inherits));
  }
  //Add inherited permissions (Array)
  else if (role.inherits != null && Array.isArray(role.inherits))
  {
    for(inherited of role.inherits)
    {
      permissions.push(...getPermissions(inherited));
    }
  }

  return permissions;
};

//Exports
module.exports = getPermissions;
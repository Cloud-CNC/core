/**
 * @fileoverview Permissions middleware
 */

//Imports
const config = require('config');

//Export
module.exports = name => async (req, res, next) =>
{
  if (getPermissions(req.user.role).includes(name))
  {
    next();
  }
  else
  {
    return res.json({
      error: {
        name: 'Insufficient Permissions',
        description: 'You don\'t have the required permissions to perform this action!'
      }
    });
  }
};

//Get all (inherited) permissions for role
function getPermissions(role)
{
  //Get ACL role
  role = config.get('core.acl.roles')[role];

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
}
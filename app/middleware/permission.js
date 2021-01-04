/**
 * @fileoverview Permissions middleware
 */

//Imports
const getPermissions = require('../lib/permission');

/**
 * Check user permissions
 * @param {String} name The permission name
 */
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
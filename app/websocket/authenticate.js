/**
 * @fileoverview Authentication route
 */

//Imports
const controller = require('../models/controller.js');
const logger = require('../lib/logger.js');

/**
* Authenticate controller function
* @param {Object} info
* @param {Function} cb
* @returns {Boolean} Accept connection
*/
module.exports = async function (info, cb)
{
  //Drop connections missing a key or ID
  if (info.req.headers == null || info.req.headers.key == null || info.req.headers._id == null)
  {
    logger.warn(`Denying controller ${info.req.connection.remoteAddress} due to missing authentication headers!`);
    cb(false);
  }
  else
  {
    //Get controller
    const doc = await controller.findById(info.req.headers._id);

    //Compare provided and valid key
    if (doc == null || doc.key != info.req.headers.key)
    {
      logger.warn(`Denying controller ${info.req.connection.remoteAddress} due to invalid key!`);
      cb(false);
    }
    else
    {
      cb(true);
    }
  }
};
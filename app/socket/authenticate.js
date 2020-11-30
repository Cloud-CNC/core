/**
 * @fileoverview Socket Authentication Middleware
 */

//Imports
const controller = require('../models/controller.js');
const logger = require('../lib/logger.js');

/**
 * Socket authentication middleware
 * @param {Socket} socket The SocketIO socket
 * @param {Function} next The middleware chain callback
 */
module.exports = async (socket, next) =>
{
  //Drop connections missing a key or ID
  if (socket.handshake.auth == null ||
    socket.handshake.auth._id == null ||
    socket.handshake.auth.key == null)
  {
    logger.warn(`Denying controller ${socket.handshake.address} due to missing authentication information!`);
    next(new Error('Missing authentication information'));
  }
  else
  {
    //Get controller
    const doc = await controller.findById(socket.handshake.auth._id);

    //Compare provided and valid key
    if (doc == null || doc.key != socket.handshake.auth.key)
    {
      logger.warn(`Denying controller ${socket.handshake.address} due to invalid key!`);
      next(new Error('Invalid key or ID'));
    }
    else
    {
      next();
    }
  }
};
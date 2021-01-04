/**
 * @fileoverview Socket Authentication Middleware
 */

//Imports
const {auth} = require('../lib/validator.js');
const controller = require('../models/controller.js');
const filters = require('../lib/filters.js');
const logger = require('../lib/logger.js');
const model = require('../models/account.js');
const mongoose = require('mongoose');

/**
 * Socket authentication middleware
 * @param {io.Socket} socket The SocketIO socket
 * @param {Function} next The middleware chain callback
 */
module.exports = async (socket, next) =>
{
  //Differentiate between clients and controllers
  if (socket.handshake.auth._id != null && socket.handshake.auth.key != null)
  {
    //Authentication payload validation
    const idAuth = auth(socket, '_id', mongoose.Types.ObjectId.isValid);
    if (idAuth != null)
    {
      return next(idAuth);
    }

    const keyAuth = auth(socket, 'key', filters.key);
    if (keyAuth != null)
    {
      return next(keyAuth);
    }

    //Get controller
    const doc = await controller.findById(socket.handshake.auth._id);

    //Compare provided and valid key
    if (doc == null || doc.key != socket.handshake.auth.key)
    {
      logger.warn(`Denying controller ${socket.handshake.address} due to invalid key!`);
      return next(new Error('Invalid key or ID'));
    }
    else
    {
      //Save connection type for later
      socket.connectionType = 'controller';

      return next();
    }
  }
  else
  {
    //Get account document
    let user;
    if (socket.request.session.impersonate != null)
    {
      user = await model.findById(socket.request.session.impersonate);
    }
    else
    {
      user = await model.findById(socket.request.session.user);
    }

    if (user == null)
    {
      return next(new Error('Invalid session (Try logging in first!'));
    }

    //Save for later
    socket.request.user = user;
    socket.connectionType = 'client';

    return next();
  }
};
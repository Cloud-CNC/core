/**
 * @fileoverview Connection route
 */

//Imports
const client = require('./client');
const controller = require('./controller');
const logger = require('../lib/logger.js');
const machine = require('../models/machine');

/**
* Connection event handler
* @param {io.Socket} socket The SocketIO socket
*/
module.exports = async socket =>
{
  switch (socket.connectionType)
  {
    //Controller connection
    case 'controller': {
      //Get the controller ID
      const id = socket.handshake.auth._id;

      //Get all associated machines
      const machines = (await machine.find({
        controller: id,
      })).map(machine => machine._id.toJSON());

      //Join the controller socket to all machine-specific rooms
      socket.join(machines);

      //Log
      logger.info(`Controller ${id} connected from ${socket.handshake.address}!`);

      //Register disconnect
      socket.on('disconnect', () =>
      {
        //Log
        logger.info(`Controller ${id} disconnected from ${socket.handshake.address}!`);

        //Disconnection handler
        controller.disconnection(id);
      });

      //Connection handler
      controller.connection(socket, id);

      break;
    }

    //Client connection
    case 'client': {
      //Log
      logger.info(`Client connected from ${socket.handshake.address}!`);

      //Register disconnect
      socket.on('disconnect', () =>
      {
        //Log
        logger.info(`Client disconnected from ${socket.handshake.address}!`);

        //Disconnection handler
        client.disconnection(socket);
      });

      //Connection handler
      client.connection(socket);

      break;
    }

    //Unknown connection type (This should probably never happen)
    default: {
      logger.error(`Unknown socket connection type ${socket.connectionType} from ${socket.handshake.address}`);

      break;
    }
  }
};
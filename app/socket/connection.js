/**
 * @fileoverview Connection route
 */

//Imports
const logger = require('../lib/logger.js');
const machine = require('../models/machine');
const redis = require('./redis');

/**
* Connection event handler
* @param {io.Socket} socket The SocketIO socket
*/
module.exports = async socket =>
{
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
    
    //Redis interconnect disconnection handler
    redis.disconnection(id);
  });

  //Redis interconnect connection handler
  redis.connection(socket, id);
};
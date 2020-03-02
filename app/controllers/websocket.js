/**
 * @fileoverview Websocket Controller
 */

//Imports
const machine = require('../models/machine');
const mongoose = require('mongoose');
const store = require('../websocket/store.js');

//Export
/**
 * Send data to a machine by its ID
 * @param {String} _id Machine ID
 * @param {Object} data Data to be forwarded to a machine
 * @returns {Promise<Object>} Controller/machine response
 */
module.exports = (_id, data) => new Promise(async (resolve, reject) =>
{
  //Get controller
  const controller = (await machine.findById(_id)).controller;

  //Get socket
  const socket = store.get(controller);

  //Ensure socket isn't null
  if (socket == null)
  {
    reject({
      error: {
        name: 'Disconnected Controller',
        description: 'The machine you\'re trying to contact is attached to a controller that isn\'t connected!'
      }
    });
  }
  else
  {
    //Generate conversation ID
    const conversation = new mongoose.Types.ObjectId();

    //Response event handler
    const response = message =>
    {
      //Parse
      message = JSON.parse(message);
      
      if (message._id == conversation.toHexString())
      {
        socket.off('message', response);
        return resolve(message);
      }
    };

    //Register event
    socket.on('message', response);

    //Send message
    socket.send(JSON.stringify({_id: conversation, machine: _id, ...data}));
  }
});
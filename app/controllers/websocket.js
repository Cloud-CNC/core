/**
 * @fileoverview Websocket Controller
 */

//Imports
const mongoose = require('mongoose');
const store = require('../websocket/store.js');

//Export
/**
 * Send data to machine by ID
 * @param {String} _id Controller ID
 * @param {Object} data Data to be sent to machine
 * @returns {Promise<Object>} Machine response
 */
module.exports = async (_id, data) => new Promise((resolve, reject) =>
{
  //Get socket
  const socket = store.get(_id);

  //Ensure socket isn't null
  if (socket == null)
  {
    return {
      error: {
        name: 'Disconnected Controller',
        description: 'The machine you\'re trying to contact a machine that is attached to a controller that isn\'t connected!'
      }
    };
  }
  else
  {
    //Generate conversation ID
    const conversation = new mongoose.Types.ObjectId();

    //Response event handler
    const response = message =>
    {
      if (message._id == id)
      {
        socket.off('response:execute', response);
        return resolve(message);
      }
    };

    //Register event
    socket.onclose('response:execute', response);

    //Send message
    socket.send(JSON.stringify({...conversation, ...data}));
  }
});
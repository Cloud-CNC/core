/**
 * @fileoverview Socket Controller
 */

//Imports
const machine = require('../models/machine');
const redis = require('../socket/redis');

//Export
/**
 * Send data to a machine by its ID
 * @param {String} id Machine ID
 * @param {String} name The name of the event
 * @param {Object} data Data to be forwarded to a machine
 * @returns {Promise<Object>} Controller/machine response
 */
module.exports = (id, name, data) => new Promise(async (resolve, reject) =>
{
  //Get the controller
  const controller = (await machine.findById(id)).controller.toJSON();

  //Make sure the controller is online
  if (!await redis.online(controller))
  {
    return reject({
      error: {
        name: 'Disconnected Controller',
        description: 'The machine you\'re trying to contact is attached to a controller that isn\'t connected!'
      }
    });
  }
  else
  {
    //Generate controller listener
    const listener = redis.listen(controller);

    //Response event handler
    const response = data =>
    {
      //Filter out other machines
      if (data.machine == id)
      {
        //Unregister the output event handler
        listener.off('output', response);

        return resolve(data.payload);
      }
    };

    //Listen to output
    listener.on('output', response);

    //Send message to the machine-specific room
    redis.emit(controller, name, {
      machine: id,
      ...data
    });
  }
});
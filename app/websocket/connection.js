/**
 * @fileoverview Connection route
 */

//Imports
const logger = require('../lib/logger.js');
const store = require('./store.js');
const {delay} = require('../../config.js').controller;

/**
* Connection event handler
* @param {WebSocket} connection Websocket
*/
module.exports = (socket, req) =>
{
  //Bind controller
  const id = req.headers._id;

  //Add to store
  store.add(socket, id);

  //Broken link detection
  const timeout = setInterval(() =>
  {
    socket.ping(err =>
    {
      if (err)
      {
        store.remove(id);
        socket.terminate();
        clearInterval(timeout);
        logger.warn(`Link with controller ${id} broke!`);
      }
    });
  }, delay);

  logger.info(`Controller ${id} successfully bound!`);

  //Events
  socket.on('message', message =>
  {
    message = JSON.parse(message);
    switch (message.event)
    {
      //Command response
      case 'response:command': {
        socket.emit('response:command', message);
        break;
      }

      //Execute response
      case 'response:execute': {
        socket.emit('response:execute', message);
        break;
      }
    }
  });

  //Delete socket from store on disconnect
  socket.on('close', () =>
  {
    store.remove(id);
    logger.info(`Controller ${id} disconnected!`);
  });
};
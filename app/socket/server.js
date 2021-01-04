/**
 * @fileoverview Cloud CNC Socket API
 */

//Imports
const authenticate = require('./authenticate');
const config = require('config');
const connection = require('./connection');
const io = require('socket.io');
const session = require('../middleware/session');

/**
 * Wrap Express middleware for use with SocketIO
 * @param {express.Middleware} middleware
 */
const wrapExpress = middleware => (socket, next) =>
{
  //Call the middleware
  middleware(socket.request, socket.request.res, next);
};

//Instance variables
/**
 * The socket server
 * @type {io.Socket}
 */
let server;

//Exports
module.exports = {
  /**
   * Safely get the server
   * @returns {io.Server}
   */
  get server()
  {
    //If the server isn't initialized, error out
    if (server == null)
    {
      throw new Error('Accessing socket server before initialization!');
    }
    else
    {
      return server;
    }
  },
  /**
   * Start/get the socket server
   * @param {http.Server} http The HTTP(S) server
   * @returns {io.Server}
   */
  connect: http =>
  {
    //If not connected, connect
    if (http != null && server == null)
    {
      //Instantiate the socket
      server = new io.Server(http, {
        cors: {
          credentials: true,
          origin: config.get('core.server.cors')
        }
      });

      //Middleware
      server.use(wrapExpress(session.generic));
      server.use(authenticate);

      //On connection
      server.on('connection', connection);
    }

    return server;
  }
};
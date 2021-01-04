/**
 * @fileoverview Client Websocket Business Logic
 */

//Imports
const {message} = require('../lib/validator');
const controller = require('./controller');
const getPermissions = require('../lib/permission');
const io = require('socket.io');
const mongoose = require('mongoose');

//Exports
module.exports = {
  /**
   * Connection handler
   * @param {io.Socket} socket The socket
   */
  connection: socket =>
  {
    //Map of output listeners
    socket.output = new Map();

    //Start streaming machine output
    socket.on('startOutput', async data =>
    {
      //Permission check
      if (!getPermissions(socket.request.user.role).includes('machines:startOutput'))
      {
        return socket.emit('error', {
          error: {
            name: 'Insufficient Permissions',
            description: 'You don\'t have the required permissions to perform this action!'
          }
        });
      }

      //Validate message
      const machineValidation = message(data, 'machine', mongoose.Types.ObjectId.isValid);
      if (machineValidation != null)
      {
        return socket.emit(machineValidation);
      }

      //Forward output (Receive from end-user perspective)
      const listener = await controller.listen(data.machine);

      //If the listener is an error, emit the error
      if (listener.error != null)
      {
        return listener;
      }

      //Listen to the output
      listener.on('output', output =>
      {
        socket.emit('output', {
          machine: data.machine,
          payload: output
        });
      });

      //Add output listener
      socket.output.set(data.machine, listener);
    });

    //Stop steaming machine output
    socket.on('stopOutput', data =>
    {
      //Permission check
      if (!getPermissions(socket.request.user.role).includes('machines:stopOutput'))
      {
        return socket.emit('error', {
          error: {
            name: 'Insufficient Permissions',
            description: 'You don\'t have the required permissions to perform this action!'
          }
        });
      }

      //Validate message
      const machineValidation = message(data, 'machine', mongoose.Types.ObjectId.isValid);
      if (machineValidation != null)
      {
        return socket.emit(machineValidation);
      }

      //Get the listener
      const listener = socket.output.get(data.machine);

      //If we can't find the listener, emit an error
      if (listener == null)
      {
        socket.emit('error', {
          error: {
            name: 'Unknown Output Listener',
            description: 'You\'re trying to stop listening to machine output but you\'re not listening to it! This can be caused by stopping listening to a machine\'s output more than once or by never listening to the machine\'s output in the first place.'
          }
        });
      }

      //Stop listening to output
      listener.emit('stop');

      //Cleanup (Prevent memory leak)
      listener.removeAllListeners();
    });

    //Send a command to a machine
    socket.on('command', async data =>
    {
      //Permission check
      if (!getPermissions(socket.request.user.role).includes('machines:command'))
      {
        return socket.emit('error', {
          error: {
            name: 'Insufficient Permissions',
            description: 'You don\'t have the required permissions to perform this action!'
          }
        });
      }

      //Validate message
      const machineValidation = message(data, 'machine', mongoose.Types.ObjectId.isValid);
      if (machineValidation != null)
      {
        return socket.emit(machineValidation);
      }

      const payloadValidation = message(data, 'payload', value => value != null);
      if (payloadValidation != null)
      {
        return socket.emit(payloadValidation);
      }

      //Send the command
      const error = await controller.command(data.machine, data.payload);

      //If the error isn't null, emit the error
      if (error != null)
      {
        return socket.emit('error', error);
      }
    });

    //Execute a file on a machine
    socket.on('execute', data =>
    {
      //Permission check
      if (!getPermissions(socket.request.user.role).includes('machines:execute'))
      {
        return socket.emit('error', {
          error: {
            name: 'Insufficient Permissions',
            description: 'You don\'t have the required permissions to perform this action!'
          }
        });
      }

      //Validate message
      const machineValidation = message(data, 'machine', mongoose.Types.ObjectId.isValid);
      if (machineValidation != null)
      {
        return socket.emit(machineValidation);
      }

      const fileValidation = message(data, 'file', mongoose.Types.ObjectId.isValid);
      if (fileValidation != null)
      {
        return socket.emit(fileValidation);
      }

      //Execute the file
      const error = controller.execute(data.machine, data.file);

      //If the error isn't null, emit the error
      if (error != null)
      {
        socket.emit('error', error);
      }
    });
  },

  /**
   * Disconnection handler
   * @param {io.Socket} socket The socket
   */
  disconnection: socket =>
  {
    //Get all listeners
    const listeners = socket.output.values();

    //Destroy all output listeners
    for (const listener of listeners)
    {
      //Stop listening to output
      listener.emit('stop');

      //Cleanup (Prevent memory leak)
      listener.removeAllListeners();
    }
  }
};
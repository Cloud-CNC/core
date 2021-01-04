/**
 * @fileoverview Controller Websocket Business Logic
 */

//Imports
const {EventEmitter} = require('events');
const bus = require('../lib/bus');
const machineController = require('../controllers/machine');
const fileController = require('../controllers/file');
const io = require('socket.io');

/**
 * Get a machine's controller's ID
 * @param {String} id The machine's ID
 */
const controllerID = async id =>
{
  //Get the machine
  const machine = await machineController.get(id);

  return machine.controller.toJSON();
};

/**
 * Check if a controller is online
 * @param {string} id The controller ID
 */
const online = async id =>
{
  //Generate the key name
  const key = `controllers#${id}#`;

  //Get from Redis
  const value = await bus.get(key);

  return value == 'online';
};

//Exports
module.exports = {
  /**
   * Connection handler
   * @param {io.Socket} socket The socket
   * @param {string} id The controller ID
   */
  connection: (socket, id) =>
  {
    //Generate the channels
    const rx = `controllers#${id}#rx#`;
    const tx = `controllers#${id}#tx#`;

    //SocketIO to Redis (Receive from end-user perspective)
    socket.on('output', data =>
    {
      //Stringify
      data = JSON.stringify(data);

      //Emit the event (Forward to the correct core instance)
      bus.emit(rx, data);
    });

    //Redis to SocketIO (Transmit from end-user perspective)
    bus.listen(tx).on('message', message =>
    {
      //Parse
      message = JSON.parse(message);

      socket.emit(message.event, message.data);
    });

    //Generate key
    const key = `controllers#${id}#`;

    //Extend the TTL if the controller is [still] online
    const extendTTL = async () =>
    {
      if (socket.connected)
      {
        //Extend TTL
        await bus.set(key, 'online', 'PX', 31000);
      }
      else
      {
        clearInterval(extendTTL);
      }
    };

    //Create the initial key (Prevents 30-second startup lag)
    extendTTL();

    /**
     * While SocketIO handles disconnect events, this system of systemically
     * extending the TTL prevents controller state desynchronization in the
     * event the server crashes (When it would be unable to delete the key from
     * Redis). Since controller state synchronization is mission critical, it's
     * imperative that it never desynchronizes for more than 30 seconds.
     */
    setInterval(extendTTL, 30000);
  },

  /**
   * Command a machine
   * @param {String} machine The machine ID
   * @param {String} payload The command
   */
  command: async (machine, payload) =>
  {
    //Get the controller ID
    const id = await controllerID(machine);

    //Ensure the machine is online
    if (!await online(id))
    {
      return {
        error: {
          name: 'Disconnected Controller',
          description: 'The machine you\'re trying to contact is attached to a controller that isn\'t connected!'
        }
      };
    }

    //Generate the channel (Transmit from end-user perspective)
    const channel = `controllers#${id}#tx#`;

    //Emit to Redis
    bus.emit(channel, JSON.stringify({
      event: 'command',
      data: {
        machine,
        payload
      }
    }));
  },

  /**
   * Execute a file on a machine
   * @param {String} machine The machine Id
   * @param {String} file The file ID
   */
  execute: async (machine, file) =>
  {
    //Get the controller ID
    const id = await controllerID(machine);

    //Ensure the machine is online
    if (!await online(id))
    {
      return {
        error: {
          name: 'Disconnected Controller',
          description: 'The machine you\'re trying to contact is attached to a controller that isn\'t connected!'
        }
      };
    }

    //Get the raw file
    const raw = fileController.raw(file);

    //Generate the channel (Transmit from end-user perspective)
    const channel = `controllers#${id}#tx#`;

    //Emit to Redis
    bus.emit(channel, JSON.stringify({
      event: 'execute',
      data: {
        file: raw,
        machine
      }
    }));
  },

  /**
   * Listen to the output from a specific machine
   * @param {string} machine The machine ID
   */
  listen: async machine =>
  {
    //Get the controller ID
    const id = await controllerID(machine);

    //Ensure the machine is online
    if (!await online(id))
    {
      return {
        error: {
          name: 'Disconnected Controller',
          description: 'The machine you\'re trying to contact is attached to a controller that isn\'t connected!'
        }
      };
    }

    //Generate the channel (Receive from end-user perspective)
    const channel = `controllers#${id}#rx#`;

    //Instantiate the event emitter
    const emitter = new EventEmitter();

    //Listen to Redis
    const listener = bus.listen(channel);
    listener.on('message', message =>
    {
      //Parse
      message = JSON.parse(message);

      //Filter out other machines
      if (message.machine == machine)
      {
        emitter.emit('output', message.payload);
      }
    });

    //Register stop
    emitter.on('stop', () =>
    {
      //Stop listening to Redis
      listener.emit('stop');

      //Remove all event listeners
      listener.removeAllListeners();
    });

    return emitter;
  },

  /**
   * Disconnection handler
   * @param {string} id The controller ID
   */
  disconnection: async id =>
  {
    //Generate the key name
    const key = `controllers#${id}#`;

    //Delete from Redis
    await bus.del(key);
  }
};
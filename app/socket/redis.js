/**
 * @fileoverview Redis Interconnect
 * 
 * See https://github.com/socketio/socket.io-redis for more information
 */

//Imports
const {EventEmitter} = require('events');
const io = require('socket.io');
const pub = require('../lib/redis').client;

//Generate an alternate Redis subscription client
const sub = pub.duplicate();

//Exports
module.exports = {
  /**
   * Connection handler
   * @param {io.Socket} socket The socket
   * @param {string} id The controller ID
   */
  connection: (socket, id) =>
  {
    //Generate the channel
    const channel = `controllers#${id}#`;

    //SocketIO to Redis (Receive from end-user perspective)
    socket.on('output', data =>
    {
      //Publish the event (Format: prefix#namespace#room#flow#)
      pub.publish(`${channel}rx`, JSON.stringify({
        connection: pub.connection_id,
        data
      }));
    });

    //Redis to SocketIO (Transmit from end-user perspective)
    sub.subscribe(`${channel}tx`);
    sub.on('message', (messageChannel, message) =>
    {
      //Filter out other channels
      if (messageChannel == `${channel}tx`)
      {
        //Parse
        const data = JSON.parse(message);

        //Filter out echo
        if (data.connection == pub.connection_id)
        {
          socket.emit(data.event, data.data);
        }
      }
    });

    //Extend the TTL if the controller is [still] online
    const extendTTL = () =>
    {
      if (socket.connected)
      {
        //Extend TTL
        pub.set(channel, 'online', 'PX', 31000);
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
   * Disconnection handler
   * @param {string} id The controller ID
   */
  disconnection: id =>
  {
    //Generate the channel
    const channel = `controllers#${id}#`;

    //Remove from Redis
    pub.del(channel);
  },
  /**
   * Check if a controller is online
   * @param {string} id The controller ID
   */
  online: async id =>
  {
    //Generate the channel
    const channel = `controllers#${id}#`;

    //Get from Redis
    const value = await new Promise((resolve, reject) =>
    {
      pub.get(channel, (err, data) =>
      {
        if (err)
        {
          reject(err);
        }
        else
        {
          resolve(data);
        }
      });
    });

    return value == 'online';
  },
  /**
   * Emit an event to a controller
   * @param {string} id The controller ID
   * @param {string} event The name of the event ("command", "execute")
   * @param {object} data The data to send
   */
  emit: (id, event, data) =>
  {
    //Generate the channel (Transmit from end-user perspective)
    const channel = `controllers#${id}#tx`;

    //Emit to Redis
    pub.publish(channel, JSON.stringify({
      connection: pub.connection_id,
      data,
      event
    }));
  },
  /**
   * Listen to the output from a specific controller
   * @param {string} id The controller ID
   */
  listen: id =>
  {
    //Generate event emitter
    const emitter = new EventEmitter();

    //Generate the channel (Receive from end-user perspective)
    const channel = `controllers#${id}#rx`;

    //Subscribe
    sub.subscribe(channel);
    sub.on('message', (messageChannel, message) =>
    {
      //Filter out other channels
      if (messageChannel == channel)
      {
        //Parse
        const data = JSON.parse(message);

        //Filter out echo
        if (data.connection == pub.connection_id)
        {
          emitter.emit('output', data.data);
        }
      }
    });

    return emitter;
  }
};
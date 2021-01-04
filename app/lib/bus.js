/**
 * @fileoverview Redis Bus Helper Functions
 */

//Imports
const {EventEmitter} = require('events');
const pub = require('./redis').client;

//Generate an alternate Redis subscription client
const sub = pub.duplicate();

//Exports
module.exports = {
  /**
   * Emit data to Redis
   * @param {String} channel 
   * @param {Object} data 
   */
  emit: (channel, data) =>
  {
    //Publish message
    pub.publish(channel, data);
  },

  /**
   * Listen to Redis
   * 
   * Messages are available from the `message` event
   * @param {String} channel 
   * @param {Boolean} pattern Wether or not the provided channel name is a pattern (Default false)
   */
  listen: (channel, pattern = false) =>
  {
    //Subscribe with appropriate subscriber function
    if (pattern)
    {
      sub.psubscribe(channel);
    }
    else
    {
      sub.subscribe(channel);
    }

    //Instantiate the event emitter
    const emitter = new EventEmitter();

    //Message callback
    const cb = (messageChannel, message) =>
    {
      //Filter out other channels
      if (messageChannel == channel)
      {
        //Emit event
        emitter.emit('message', message);
      }
    };

    //Listen
    sub.on('message', cb);

    //Register stop
    emitter.on('stop', () =>
    {
      //Unsubscribe
      sub.unsubscribe(channel);

      //Remove event listener
      sub.off('message', cb);
    });

    return emitter;
  },

  /**
   * Get a key-value pair from Redis
   * @param {String} key
   */
  get: key => new Promise((resolve, reject) =>
  {
    //Get the kv pair from Redis
    pub.get(key, (err, value) =>
    {
      if (err)
      {
        reject(err);
      }
      else
      {
        resolve(value);
      }
    });
  }),

  /**
   * Set a key-value pair in Redis
   * @param {String} key
   * @param {Object} value
   */
  set: (key, value, ...args) => new Promise((resolve, reject) =>
  {
    //Set the kv pair in Redis
    pub.set(key, value, ...args, err =>
    {
      if (err)
      {
        reject(err);
      }
      else
      {
        resolve();
      }
    });
  }),

  /**
   * Delete a key-value pair from Redis
   * @param {String} key
   */
  del: key => new Promise((resolve, reject) =>
  {
    //Delete the kv pair from Redis
    pub.del(key, err =>
    {
      if (err)
      {
        reject(err);
      }
      else
      {
        resolve();
      }
    });
  })
};
/**
 * @fileoverview Websocket store
 */

//Private
const store = {};

//Export
module.exports = {
  /**
   * Add socket + controller ID to store
   * @param {Object} socket 
   * @param {String} id
   */
  add(socket, id)
  {
    store[id] = socket;
  },
  /**
   * Get socket by controller ID
   * @param {String} id 
   * @returns {WebSocket}
   */
  get(id)
  {
    return store[id];
  },
  /**
   * Remove connection by controller ID
   * @param {String} id 
   */
  remove(id)
  {
    delete store[id];
  }
};
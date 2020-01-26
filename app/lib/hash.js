/**
 * @fileoverview Argon2 hashing module
 */

//Imports
const argon2 = require('argon2');
const os = require('os');

//Export
/**
 * Hash raw
 * @param {String} raw
 * @returns {Promise<String>}
 */
module.exports = async function (raw)
{
  return await argon2.hash(raw, {memoryCost: 2 ** 16, parallelism: os.cpus().length, type: argon2.argon2id});
};
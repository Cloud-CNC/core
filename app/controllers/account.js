/**
 * @fileoverview Account Controller
 */

//Imports
const file = require('../models/file');
const hash = require('../lib/hash');
const model = require('../models/account');
const speakeasy = require('speakeasy');
const {core} = require('../../config');

//Export
module.exports = {
  /**
   * Get all accounts
   * @returns {Promise<Array<{username: String, mfa: Boolean, role: String}>>} Array of accounts
   */
  all: async () =>
  {
    const docs = await model.find(null, ['username', 'mfa', 'role']);
    return docs.map(doc => doc.toJSON());
  },

  /**
   * Get all roles
   * @returns {Array<String>}
   */
  roles: () =>
  {
    return {roles: Object.keys(core.acl.roles)};
  },

  /**
   * Create an account
   * @param {String} username Account username
   * @param {String} password Account password
   * @param {Boolean} mfa MFA enabled
   * @param {String} role Account role
   * @returns {Promise<{_id: String, otpauth?: String}>} Contains `_id` and optionally `otpauth` (URL) if mfa was requested
   */
  create: async (username, password, mfa, role) =>
  {
    //MFA
    const secret = mfa ? speakeasy.generateSecret({
      name: 'Cloud CNC',
      length: 64
    }) : null;

    const doc = new model({
      username,
      hash: await hash(password),
      mfa,
      secret: mfa ? secret.base32 : null,
      role
    });

    await doc.save();
    return mfa ? {_id: doc._id, otpauth: secret.otpauth_url} : {_id: doc._id};
  },

  impersonate: {
    /**
     * Start impersonating account
     * @param {Object} session Persistent session
     * @param {String} _id ID of the account to impersonate
     */
    start: async (session, _id) =>
    {
      session.impersonate = _id;
    },

    /**
     * Stop impersonating account
     * @param {Object} session Persistent session
     */
    stop: async session =>
    {
      session.impersonate = null;
    }
  },

  /**
   * Get an account by its ID
   * @param {String} _id Account ID
   * @returns {Promise<{username :String, mfa: Boolean, role: String}>} Where `mfa` represents if the user has MFA enabled
   */
  get: async _id =>
  {
    const doc = await model.findById(_id, ['username', 'mfa', 'role']);
    return doc.toJSON();
  },

  /**
   * Update an account by its ID
   * @param {String} _id Account ID
   * @param {String} source Source account ID (To check for permission escalation)
   * @param {Object} data Data to update account with
   * @returns {Promise<{otpauth?: String}>} Optionally contains `otpauth` (URL) if mfa was requested
   */
  update: async (_id, source, data) =>
  {
    let secret = {};

    //Generate MFA secret
    if (data.mfa)
    {
      secret = speakeasy.generateSecret({
        name: 'Cloud CNC',
        length: 64
      });

      data.secret = secret.base32;
    }
    //Erase secret of MFA no longer needed
    else if (data.mfa == false)
    {
      data.secret = null;
    }

    //Hash password
    if (data.password != null)
    {
      data.hash = await hash(data.password);
      delete data.password;
    }

    //Prevent privilege escalation
    if (data.role != null)
    {
      const sourceRole = (await model.findById(source)).role;
      const roles = Object.keys(core.acl.roles);
      if (!roles.includes(data.role) || roles.indexOf(data.role) < roles.indexOf(sourceRole))
      {
        return {
          error: {
            name: 'Privilege Escalation',
            description: 'You\'re trying to increase the permissions of your own account!'
          }
        };
      }
    }

    //Update
    await model.findByIdAndUpdate(_id, data);

    return {otpauth: secret.otpauth_url};
  },

  /**
   * Remove account by its ID
   * @param {String} _id Account ID
   * @returns {Promise<void|{error: {name: String, description: String}}>}
   */
  remove: async _id =>
  {
    const files = await file.find({owner: _id});

    if (files.length > 0)
    {
      return {
        error: {
          name: 'Child Files',
          description: 'The account you\'re trying to remove still owns file(s). Please remove them before retrying!'
        }
      };
    }
    else
    {
      await model.findByIdAndDelete(_id);
    }
  }
};
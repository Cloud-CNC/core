/**
 * @fileoverview Session Controller
 */

const argon2 = require('argon2');
const model = require('../models/account');
const speakeasy = require('speakeasy');

//Export
module.exports = {
  /**
   * Log user in
   * @param {Object} session Persistent session
   * @param {String} username Account username
   * @param {String} password Account password
   * @returns {Promise<{valid: Boolean, mfa?: Boolean}>} Where `mfa` represents if the user needs to authenticated via MFA
   */
  login: async (session, username, password) =>
  {
    //Get user
    const user = await model.findOne({username}).exec();

    if (user == null)
    {
      return {valid: false};
    }
    else
    {
      //Verify password
      if (await argon2.verify(user.hash, password))
      {
        //Finish authentication if MFA is disabled
        if (!user.mfa)
        {
          session.authenticated = true;
        }

        //Store user ID
        session.user = user._id;
        return {valid: true, mfa: user.mfa};
      }
      else
      {
        return {valid: false};
      }
    }
  },

  /**
   * Finish authenticating user via MFA
   * @param {Object} session Persistent session
   * @param {String} otp One time password
   * @returns {Promise<{valid: Boolean}>} `valid: <Boolean>`
   */
  mfa: async (session, otp) =>
  {
    //Get user
    const user = await model.findById(session.user);

    //Veritfy OTP
    const valid = speakeasy.totp.verify({
      encoding: 'base32',
      secret: user.secret,
      token: otp,
      window: 1
    });

    //Finish authenticating user
    if (valid)
    {
      session.authenticated = true;
    }

    return {valid};
  },

  /**
   * Log user out
   * @param {Object} session Persistent session
   * @returns {Promise<void|{error: {name: String, description: String}}>}
   */
  logout: async session => new Promise((resolve, reject) =>
  {
    session.destroy(err =>
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
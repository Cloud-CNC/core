/**
 * @fileoverview Session controller
 */

//Imports
const argon2 = require('argon2');
const {filters} = require('../../config.js');
const model = require('../models/account.js');

//Export
module.exports = {
  /**
  * Log user in
  * @param {Express.Request} req
  * @param {Express.Response} res
  */
  login: async function (req, res)
  {
    //Validate
    if (req.body.username == null || !filters.username.test(req.body.username))
    {
      return res.json({
        error: {
          name: 'Missing Parameter',
          description: '"username" wasn\'t found!'
        }
      });
    }
    else if (req.body.password == null || !filters.password.test(req.body.password))
    {
      return res.json({
        error: {
          name: 'Missing Parameter',
          description: '"password" wasn\'t found!'
        }
      });
    }
    else
    {
      //Get user from database
      const user = await model.findOne({username: req.body.username}).exec();
      if (user == null)
      {
        return res.json({valid: false});
      }

      //Hash
      argon2.verify(user.hmac, req.body.password).then(valid =>
      {
        if (valid)
        {
          req.session.user = user._id.toJSON();
          return res.json({valid: true});
        }
        else
        {
          return res.json({valid: false});
        }
      });
    }
  },

  /**
   * Log user out
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  logout: function (req, res)
  {
    req.session.destroy(err =>
    {
      if (err)
      {
        res.status(500);
        return res.json({
          error: {
            name: 'Failed To Remove Session',
            description: 'An error occurred when trying to remove your session!'
          }
        });
      }
      else
      {
        return res.end();
      }
    });
  }
};
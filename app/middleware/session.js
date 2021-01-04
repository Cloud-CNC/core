/**
 * @fileoverview Session middleware
 */

//Imports
const config = require('config');
const fs = require('fs');
const model = require('../models/account.js');
const redis = require('../lib/redis').client;
const session = require('express-session');
const store = require('connect-redis')(session);

//Exports
module.exports = {
  /**
   * Generic session middleware (HTTP or Websocket)
   */
  generic: session({
    name: 'session',
    cookie: {
      httpOnly: true,
      maxAge: config.get('core.server.sessionExpire'),
      sameSite: true,
      secure: true
    },
    store: new store({
      client: redis,
      prefix: 'sessions#'
    }),
    resave: false,
    saveUninitialized: false,
    secret: fs.readFileSync(config.get('core.cryptography.secret'), 'utf8'),
    unset: 'destroy'
  }),

  /**
   * HTTP-specific session middleware
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {Function} next 
   */
  http: async (req, res, next) =>
  {
    if (req.url == '/sessions/login' ||
      req.url == '/sessions/mfa' ||
      req.session.authenticated)
    {
      //Get account document
      if (req.session.impersonate != null)
      {
        req.user = await model.findById(req.session.impersonate);
      }
      else
      {
        req.user = await model.findById(req.session.user);
      }

      next();
    }
    else
    {
      return res.status(401).json({
        error: {
          name: 'Unrecognized Session',
          description: 'Please log in (again)'
        }
      });
    }
  }
};
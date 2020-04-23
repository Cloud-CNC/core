/**
 * @fileoverview Session middleware
 */

//Imports
const config = require('config');
const fs = require('fs');
const model = require('../models/account.js');
const router = require('express').Router();
const session = require('express-session');
const store = require('connect-mongodb-session')(session);

//Session
router.use(session({
  name: 'session',
  cookie: {
    domain: config.get('core.server.domain'),
    httpOnly: true,
    maxAge: config.get('core.server.sessionExpire'),
    sameSite: true,
    secure: true
  },
  store: new store({
    uri: config.get('core.data.database'),
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: false,
  secret: fs.readFileSync(config.get('core.cryptography.secret'), 'utf8'),
  unset: 'destroy'
}));

//Logic
router.use(async (req, res, next) =>
{
  if (req.url == '/sessions/login' || req.url == '/sessions/mfa' || req.session.authenticated)
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
});

//Export
module.exports = router;
/**
 * @fileoverview Session middleware
 */

//Imports
const config = require('../../config.js');
const fs = require('fs');
const router = require('express').Router();
const session = require('express-session');
const store = require('connect-mongodb-session')(session);

//Session
router.use(session({
  name: 'session',
  cookie: {
    domain: config.core.domain,
    httpOnly: true,
    maxAge: config.core.expire,
    sameSite: true,
    secure: true
  },
  store: new store({
    uri: config.data.database,
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: false,
  secret: fs.readFileSync(config.core.secret, 'utf8'),
  unset: 'destroy'
}));

//Logic
router.use(async (req, res, next) =>
{
  if (req.url == '/sessions/login' || req.session.user != null)
  {
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
/**
 * @fileoverview Account controller
 */

//Imports
const create = require('../lib/create.js');
const fileModel = require('../models/file.js');
const hash = require('../lib/hash.js');
const model = require('../models/account.js');
const speakeasy = require('speakeasy');
const update = require('../lib/update.js');
const {core, filters} = require('../../config.js');

//Logic
module.exports = {
  getAll: async function (req, res)
  {
    const docs = await model.find();
    return res.json(docs.map(doc => doc.toJSON()));
  },
  create: async function (req, res)
  {
    const constructor = create(req.body, {
      role: filters.role,
      username: filters.username,
      password: filters.password,
      mfa: filters.boolean
    }, res);

    if (constructor != null)
    {
      constructor.hash = await hash(constructor.password);
      delete constructor.password;

      const body = {};

      if (constructor.mfa)
      {
        const secret = speakeasy.generateSecret({
          name: 'Cloud CNC',
          length: core.otpSecretLength
        });

        constructor.mfa = true;
        constructor.secret = secret.base32;
        body.otpauth = secret.otpauth_url;
      }

      const doc = new model(constructor);
      await doc.save();
      return res.json({_id: doc.id, ...body});
    }
  },
  impersonateStart: async function (req, res)
  {
    req.session.impersonate = req.params.id;
    req.user = await model.findById(req.params.id);

    return res.end();
  },
  impersonateStop: async function (req, res)
  {
    req.session.impersonate = null;
    req.user = await model.findById(req.session.user);

    return res.end();
  },
  get: function (req, res)
  {
    return res.json(req.account.toJSON());
  },
  update: async function (req, res)
  {
    const success = update(req.body, req.account, {
      role: filters.role,
      username: filters.username,
      password: filters.password,
      mfa: filters.boolean
    }, res);

    if (success)
    {
      if (req.account.mfa)
      {
        const secret = speakeasy.generateSecret({
          name: 'Cloud CNC',
          length: core.otpSecretLength
        });

        req.account.secret = secret.base32;
        await req.account.save();

        return res.json({otpauth: secret.otpauth_url});
      }
      else
      {
        req.account.secret = null;
        await req.account.save();

        return res.end();
      }
    }
  },
  remove: async function (req, res)
  {
    //Make sure no child files exist
    const files = await fileModel.find({owner: req.account._id});

    if (files.length > 0)
    {
      return res.status(409).json({
        error: {
          name: 'Child Files',
          description: 'The account you\'re trying to remove still owns file(s). Please remove them before retrying!'
        }
      });
    }
    else
    {
      await req.account.remove();
      return res.end();
    }
  }
};
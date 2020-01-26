/**
 * @fileoverview Account controller
 */

//Imports
const create = require('../lib/create.js');
const {filters} = require('../../config.js');
const hash = require('../lib/hash.js');
const model = require('../models/account.js');
const update = require('../lib/update.js');

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
      firstName: filters.name,
      lastName: filters.name
    }, res);

    if (constructor != null)
    {
      constructor.hmac = await hash(constructor.password);
      delete constructor.password;

      const doc = new model(constructor);
      await doc.save();
      return res.json({_id: doc.id});
    }
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
      firstName: filters.name,
      lastName: filters.name
    }, res);

    if (success)
    {
      await req.account.save();
      return res.end();
    }
  },
  delete: async function (req, res)
  {
    await req.account.remove();
    return res.end();
  }
};
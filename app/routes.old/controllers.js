/**
 * @fileoverview Controllers routes
 */

//Imports
const controller = require('../controllers/controller.js');
const model = require('../models/controller.js');
const permission = require('../middleware/permission.js');
const router = require('express').Router();

//Get controller
router.param('id', async (req, res, next, param) =>
{
  const doc = await model.findById(param);

  if (doc == null)
  {
    return res.status(404).json({
      error: {
        name: 'Invalid Controller',
        description: 'The specified controller doesn\'t exist!'
      }
    });
  }
  else
  {
    req.controller = doc;
    next();
  }
});

//Routes
router.get('/all', permission('controllers:all'), controller.getAll);
router.post('/', permission('controllers:create'), controller.create);
router.get('/:id', permission('controllers:get'), controller.get);
router.patch('/:id', permission('controllers:update'), controller.update);
router.delete('/:id', permission('controllers:remove'), controller.remove);

//Export
module.exports = router;
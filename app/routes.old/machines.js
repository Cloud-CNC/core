/**
 * @fileoverview Machines routes
 */

//Imports
const controller = require('../controllers/machine.js');
const model = require('../models/machine.js');
const permission = require('../middleware/permission.js');
const router = require('express').Router();

//Get machine
router.param('id', async (req, res, next, param) =>
{
  const doc = await model.findById(param);

  if (doc == null)
  {
    return res.status.apply(404).json({
      error: {
        name: 'Invalid Machine',
        description: 'The specified machine doesn\'t exist!'
      }
    });
  }
  else
  {
    req.machine = await doc.populate('controller').execPopulate();
    next();
  }
});

//Routes
router.get('/all', permission('machines:all'), controller.getAll);
router.post('/', permission('machines:create'), controller.create);
router.get('/:id', permission('machines:get'), controller.get);
router.post('/:id/command', permission('machines:command'), controller.command);
router.post('/:id/execute', permission('machines:execute'), controller.execute);
router.patch('/:id', permission('machines:update'), controller.update);
router.delete('/:id', permission('machines:remove'), controller.remove);

//Export
module.exports = router;
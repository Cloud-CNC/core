/**
 * @fileoverview Multipart parser middleware
 */

//Imports
const {IncomingForm} = require('formidable');

/**
 * Parse `multipart/form-data` routes
 * @returns {Function} Express middleware
 */
module.exports = () => (req, _, next) =>
{
  //Create the parser
  const parser = new IncomingForm();

  //Parse
  parser.parse(req, (err, fields, files) =>
  {
    //Handle error
    if (err != null)
    {
      next(err);
    }
    else
    {
      //Store parsed data for `form` validator middleware
      req.fields = fields;
      req.files = files;

      next();
    }
  });
};
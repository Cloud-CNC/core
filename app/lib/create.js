/**
 * @fileoverview Create object
 */

/**
 * Create object
 * @param {Object} data Raw request data
 * @param {Object} props Object containing key-value pairs of properties to be validated
 * @param {Express.Response} res Express response object used for rejecting request
 * @returns {Boolean|Object} Constructor for mongoose document
 */
module.exports = (data, props, res) =>
{
  const constructor = {};

  for(const prop of Object.keys(props))
  {
    //Get filter
    const filter = props[prop];

    //Validate
    if (data[prop] == null)
    {
      res.status(422).json({
        error: {
          name: 'Missing Parameter',
          description: `"${prop}" wasn't found!`
        }
      });

      return null;
    }
    else if ((filter.constructor.name == 'RegExp' && !filter.test(data[prop])) || (filter.constructor.name == 'Function' && !filter(data[prop])))
    {
      res.status(422).json({
        error: {
          name: 'Invalid Parameter',
          description: `"${prop}" must match the specified filter!`
        }
      });

      return null;
    }
    else
    {
      constructor[prop] = data[prop];
    }
  }

  return constructor;
};
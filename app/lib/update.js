/**
 * @fileoverview Update object
 */

/**
 * Update object
 * @param {Object} data Raw request data
 * @param {Object} doc Original document
 * @param {Object} props Object containing key-value pairs of properties to be validated
 * @param {Express.Response} res Express response object used for rejecting request
 * @returns {Boolean} Success
 */
module.exports = (data, doc, props, res) =>
{
  for (const prop of Object.keys(props))
  {
    //Get filter
    const filter = props[prop];

    //Validate
    if (data[prop] != null && ((filter.constructor.name == 'RegExp' && !filter.test(data[prop])) || (filter.constructor.name == 'Function' && !filter(data[prop]))))
    {
      res.status(422).json({
        error: {
          name: 'Invalid Parameter',
          description: `"${prop}" must match the specified filter!`
        }
      });

      return false;
    }
    else if (data[prop] != null)
    {
      doc[prop] = data[prop];
    }
  }

  return true;
};
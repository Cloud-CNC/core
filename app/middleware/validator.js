/**
 * @fileoverview Validation middleware
 */

//Export
module.exports = {
  /**
   * Validate body parameter
   * @param {String} name Name of parameter
   * @param {RegExp} filter Regex filter
   */
  body: (name, filter) => (req, res, next) =>
  {
    if (req.body[name] != null && filter.test(req.body[name]))
    {
      next();
    }
    else if (req.body[name] != null)
    {
      return res.json({
        error: {
          name: 'Invalid Body Parameter',
          description: `"${name}" must match the defined filters!`
        }
      });
    }
    else
    {
      return res.json({
        error: {
          name: 'Missing Body Parameter',
          description: `"${name}" wasn't found!`
        }
      });
    }
  },

  /**
   * Validate route parameter
   * @param {String} name Name of parameter
   * @param {RegExp} filter Regex filter
   */
  route: (name, filter) => (req, res, next) =>
  {
    if (req.params[name] != null && filter.test(req.params[name]))
    {
      next();
    }
    else if (req.params[name] != null)
    {
      return res.json({
        error: {
          name: 'Invalid Route Parameter',
          description: `"${name}" must match the defined filters!`
        }
      });
    }
    else
    {
      return res.json({
        error: {
          name: 'Missing Route Parameter',
          description: `"${name}" wasn't found!`
        }
      });
    }
  },

  /**
   * Validate query parameter
   * @param {String} name Name of parameter
   * @param {RegExp} filter Regex filter
   */
  query: (name, filter) => (req, res, next) =>
  {
    if (req.query[name] != null && filter.test(req.query[name]))
    {
      next();
    }
    else if (req.query[name] != null)
    {
      return res.json({
        error: {
          name: 'Invalid Query Parameter',
          description: `"${name}" must match the defined filters!`
        }
      });
    }
    else
    {
      return res.json({
        error: {
          name: 'Missing Query Parameter',
          description: `"${name}" wasn't found!`
        }
      });
    }
  }
};
/**
 * @fileoverview Validation middleware
 */

/**
 * Validate name from source against filter
 * @param {Object} source
 * @param {String} name
 * @param {RegExp|Function} filter
 * @returns {Boolean}
 */
function validate(source, name, filter)
{
  return source[name] != null && ((filter.constructor.name == 'RegExp' && filter.test(source[name])) || (typeof filter == 'function' && filter(source[name])));
}

//Export
module.exports = {
  /**
   * Validate websocket auth header field
   * @param {io.Socket} socket
   * @param {String} name
   * @param {RegExp|Function} filter
   */
  auth: (socket, name, filter) =>
  {
    if (!validate(socket.handshake.auth, name, filter))
    {
      return new Error(`Auth header field "${name}" was either not found or did not match the defined filters!`);
    }
  },

  /**
   * Validate websocket message
   * @param {Object} message 
   * @param {String} name 
   * @param {RegExp|Function} filter 
   */
  message: (message, name, filter) =>
  {
    if (!validate(message, name, filter))
    {
      return new Error(`Message field "${name}" was either not found or did not match the defined filters!`);
    }
  },

  /**
   * Validate only one or more of the parameters from the specified source
   * Also strips away extraneous data (Sanitizer)
   * Sets req.data to sanitized data
   * @param {String} source Root is Express.request
   * @param {Array<{name: RegExp|Function}>} parameters Key: parameter name, value: parameter filter
   * @returns {Function} Express middleware
   */
  onePlus: (source, parameters) => (req, res, next) =>
  {
    const clean = {};

    //Validate individual parameters
    for (parameter of Object.keys(parameters))
    {
      //If valid, clone data
      if (validate(req[source], parameter, parameters[parameter]))
      {
        clean[parameter] = req[source][parameter];
      }
      else if (req[source][parameter] != null)
      {
        return res.json({
          error: {
            name: `Invalid ${source} parameter`,
            description: `"${parameter}" must match the defined filters!`
          }
        });
      }
    }

    //Evaluate validated parameters
    if (Object.keys(clean).length == 0)
    {
      return res.json({
        error: {
          name: `Too few ${source} parameters`,
          description: 'You need to pass more parameters to this route'
        }
      });
    }
    else
    {
      req.data = clean;
      next();
    }
  },

  /**
   * Validate body parameter
   * @param {String} name Name of parameter
   * @param {RegExp|Function} filter Regex filter or boolean returning function
   * @returns {Function} Express middleware
   */
  body: (name, filter) => (req, res, next) =>
  {
    if (validate(req.body, name, filter))
    {
      next();
    }
    else if (req.body[name] != null)
    {
      return res.json({
        error: {
          name: 'Invalid body parameter',
          description: `"${name}" must match the defined filters!`
        }
      });
    }
    else
    {
      return res.json({
        error: {
          name: 'Missing body parameter',
          description: `"${name}" wasn't found!`
        }
      });
    }
  },

  /**
   * Validate multipart fields
   * @param {String} name Name of field
   * @param {RegExp|Function} filter Regex filter or boolean returning function
   * @returns {Function} Express middleware
   */
  field: (name, filter) => (req, res, next) =>
  {
    if (validate(req.fields, name, filter))
    {
      next();
    }
    else if (req.fields[name] != null)
    {
      return res.json({
        error: {
          name: 'Invalid multipart field',
          description: `"${name}" must match the defined filters!`
        }
      });
    }
    else
    {
      return res.json({
        error: {
          name: 'Missing multipart field',
          description: `"${name}" wasn't found!`
        }
      });
    }
  },

  /**
   * Validate multipart files
   * @param {String} name Name of file
   * @returns {Function} Express middleware
   */
  file: name => (req, res, next) =>
  {
    if (req.files[name] != null)
    {
      next();
    }
    else
    {
      return res.json({
        error: {
          name: 'Invalid multipart file',
          description: `"${name}" must match the defined filters!`
        }
      });
    }
  },

  /**
   * Validate query parameter
   * @param {String} name Name of parameter
   * @param {RegExp|Function} filter Regex filter
   * @returns {Function} Express middleware
   */
  query: (name, filter) => (req, res, next) =>
  {
    if (validate(req.query, name, filter))
    {
      next();
    }
    else if (req.query[name] != null)
    {
      return res.json({
        error: {
          name: 'Invalid query parameter',
          description: `"${name}" must match the defined filters!`
        }
      });
    }
    else
    {
      return res.json({
        error: {
          name: 'Missing query parameter',
          description: `"${name}" wasn't found!`
        }
      });
    }
  },

  /**
   * Validate route parameter
   * @param {String} name Name of parameter
   * @param {RegExp|Function} filter Regex filter
   * @returns {Function} Express middleware
   */
  route: (name, filter) => (req, res, next) =>
  {
    if (validate(req.route, name, filter))
    {
      next();
    }
    else if (req.params[name] != null)
    {
      return res.json({
        error: {
          name: 'Invalid route parameter',
          description: `"${name}" must match the defined filters!`
        }
      });
    }
    else
    {
      return res.json({
        error: {
          name: 'Missing route parameter',
          description: `"${name}" wasn't found!`
        }
      });
    }
  },
};
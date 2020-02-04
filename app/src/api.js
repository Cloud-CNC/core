/**
 * @fileoverview API Wrapper
 */

/**
 * API Wrapper
 */
export default {
  sessions: {
    /**
     * Log user in
     * @param {String} username 
     * @param {String} password 
     */
    login(username, password)
    {
      return rest('POST', '/sessions/login', {
        username,
        password
      });
    },
    /**
     * Log user in with OTP
     * @param {String} otp 
     */
    async mfa(otp)
    {
      return (await rest('POST', '/sessions/mfa', {
        otp
      })).valid;
    },
    /**
     * Log user out
     */
    async logout()
    {
      await rest('POST', '/sessions/logout');
    }
  },
  accounts: {
    /**
     * Get all accounts
     */
    all()
    {
      return rest('GET', '/accounts/all');
    },
    /**
     * Create an account
     * @param {String} role 'admin' or 'user'
     * @param {String} firstName 
     * @param {String} lastName 
     * @param {String} username 
     * @param {String} password 
     * @param {Boolean} mfa
     */
    async create(role, firstName, lastName, username, password, mfa)
    {
      return rest('POST', '/accounts', {
        role, firstName, lastName, username, password, mfa
      });
    },
    impersonate: {
      /**
       * Start impersonating target account
       * @param {String} id 
       */
      async start(id)
      {
        await rest('POST', `/accounts/${id}/impersonate/start`);
      },
      /**
       * Stop impersonating target account
       */
      async stop()
      {
        await rest('POST', '/accounts/impersonate/stop');
      }
    },
    /**
     * Get an account
     * @param {String} id 
     */
    get(id = 'own')
    {
      return rest('GET', `/accounts/${id}`);
    },
    /**
     * Update an account
     * @param {Object} data 
     * @param {String} data.role
     * @param {String} data.firstName
     * @param {String} data.lastName
     * @param {String} data.username
     * @param {String} data.password
     * @param {String} data.mfa
     * @param {String} id 
     */
    async update(data, id = 'own')
    {
      await rest('PATCH', `/accounts/${id}`, data);
    },
    /**
     * Remove an account
     * @param {String} id 
     */
    async remove(id = 'own')
    {
      await rest('DELETE', `/accounts/${id}`);
    }
  },
  files: {
    /**
     * Get all files
     */
    all()
    {
      return rest('GET', '/files/all');
    },
    /**
     * Create a file
     * @param {String} name 
     * @param {String} description 
     * @param {String} raw 
     */
    async create(name, description, raw)
    {
      return (await rest('POST', '/files', {
        name, description, raw
      }))._id;
    },
    /**
     * Get a file
     * @param {String} id 
     */
    get(id)
    {
      return rest('GET', `/files/${id}`);
    },
    /**
     * Update a file
     * @param {Object} data 
     * @param {String} data.name
     * @param {String} data.description
     * @param {String} data.raw
     * @param {String} id 
     */
    async update(data, id)
    {
      await rest('PATCH', `/files/${id}`, data);
    },
    /**
     * Remove a file
     * @param {String} id
     */
    async remove(id)
    {
      await rest('DELETE', `/files/${id}`);
    }
  },
  trash: {
    /**
     * Get all trash
     */
    all()
    {
      return rest('GET', '/trash/all');
    },
    /**
     * Recover a file
     * @param {String} id
     */
    async recover(id)
    {
      await rest('PUT', `/trash/${id}`);
    },
    /**
     * Remove a file permanently
     * @param {String} id
     */
    async remove(id)
    {
      await rest('DELETE', `/trash/${id}`);
    }
  },
  controllers: {
    /**
     * Get all controllers
     */
    all()
    {
      return rest('GET', '/controllers/all');
    },
    /**
     * Create a controller
     * @param {String} name 
     */
    async create(name)
    {
      const res = await rest('POST', '/controllers', {
        name
      });
      
      return {
        _id: res._id,
        key: res.key
      };
    },
    /**
     * Get a controller
     * @param {String} id 
     */
    get(id)
    {
      return rest('GET', `/controllers/${id}`);
    },
    /**
     * Update a controller
     * @param {Object} data 
     * @param {String} data.name
     * @param {String} id 
     */
    async update(data, id)
    {
      await rest('PATCH', `/controllers/${id}`, data);
    },
    /**
     * Remove a controller
     * @param {String} id
     */
    async remove(id)
    {
      await rest('DELETE', `/controllers/${id}`);
    }
  },
  machines: {
    /**
     * Get all machines
     */
    all()
    {
      return rest('GET', '/machines/all');
    },
    /**
     * Create a machine
     * @param {String} controller
     * @param {String} name 
     * @param {Array<String>} tags 
     * @param {Number} length 
     * @param {Number} width 
     * @param {Number} height
     */
    async create(controller, name, tags, length, width, height)
    {
      const res = await rest('POST', '/machines', {
        controller, name, tags, length, width, height
      });

      return {
        _id: res._id,
        controller: res.controller
      };
    },
    /**
     * Get a machine
     * @param {String} id 
     */
    get(id)
    {
      return rest('GET', `/machines/${id}`);
    },
    /**
     * Send a command to a machine
     * @param {String} id 
     * @param {String} command 
     */
    async command(id, command)
    {
      return rest('POST', `/machines/${id}/command`, {command});
    },
    /**
     * Start executing the specified file on the specified machine
     * @param {String} id 
     * @param {String} file 
     */
    execute(id, file)
    {
      return rest('POST', `/machines/${id}/execute`, {file});
    },
    /**
     * Update a machine
     * @param {Object} data 
     * @param {String} data.role
     * @param {String} data.firstName
     * @param {String} data.lastName
     * @param {String} data.username
     * @param {String} data.password
     * @param {String} id 
     */
    async update(data, id)
    {
      await rest('PATCH', `/machines/${id}`, data);
    },
    /**
     * Remove a machine
     * @param {String} id
     */
    async remove(id)
    {
      await rest('DELETE', `/machines/${id}`);
    }
  }
};

/**
 * Simplified REST API client
 * @param {String} method HTTP Mwthod
 * @param {String} url Relative URL
 * @param {Object} body JSON Body
 * @returns {Promise<Object>}
 */
async function rest(method, url, body = null)
{
  //Configuration
  const options = {credentials: 'include', method};
  if (body != null)
  {
    options.body = JSON.stringify(body);
    options.headers = {'Content-Type': 'application/json'};
  }

  //Request
  let res = await (await fetch(`/api${url}`, options)).text();

  //Parse
  try
  {
    res = JSON.parse(res);
  }
  catch (e)
  {}

  //Error
  if (res.error && res.error.name == 'Unrecognized Session')
  {
    window.$router.push('/login');
  }
  else if (res.error)
  {
    //Display popup
    window.vm.$children[0].error = res.error;

    //Log
    console.error(res.error);
    return Promise.reject(res.error);
  }
  else
  {
    return Promise.resolve(res);
  }
}
/**	
 * @fileoverview Default development Cloud CNC core config
 * This config file uses sain defaults
 */

//Export	
module.exports = {
  core: {
    //Access Control List (Controls what permissions each role has)	
    acl: {
      //List of roles
      roles: {
        //Role name
        admin: {
          //What permissions this role inherits
          inherits: 'user',

          //What permissions this role gains
          rules: [
            'accounts:all',
            'accounts:create',
            'accounts:impersonate:start',
            'controllers:all',
            'controllers:create',
            'controllers:key',
            'controllers:get',
            'controllers:update',
            'controllers:remove',
            'machines:create',
            'machines:update',
            'machines:remove'
          ]
        },
        //Role name
        user: {
          //What permissions this role gains
          rules: [
            'accounts:roles',
            'accounts:impersonate:stop',
            'accounts:get',
            'accounts:update',
            'accounts:remove',
            'files:all',
            'files:create',
            'files:get',
            'files:raw',
            'files:update',
            'files:remove',
            'trash:all',
            'trash:recover',
            'trash:remove',
            'machines:all',
            'machines:get',
            'machines:command',
            'machines:execute'
          ]
        }
      }
    },

    //Cryptography options
    cryptography: {
      //TLS certificate	and key location (PEM encoded)
      cert: './config/cert.cer',
      key: './config/key.pem',

      //Self signed (Temporarily trust certificate when running healthcheck and tests)
      selfSigned: true,

      //Enable TLS (If enabled, you must provide TLS certificates)
      tls: true,

      //CT maximum age (Seconds)
      ct: 60 * 60 * 24 * 30,

      //HSTS maximum age (Seconds)
      hsts: 60 * 60 * 24 * 30,

      //Session secret location	(Used to generate session cookies, should be at least 512 bytes long)
      secret: './config/secret.txt',

      //[ADVANCED USERS ONLY] Length of OTP/MFA secret (Bytes)	
      otpSecretLength: 32,

      //[ADVANCED USERS ONLY] OTP/MFA window forgiveness (30 second units)	
      otpWindows: 1
    },

    //Persistant data storage
    data: {
      //MongoDB URI	
      database: `mongodb://localhost:27017/${process.env.DB || 'cloud-cnc-development'}`,

      //Filesystem (Used for storing user files)	
      filesystem: './files/',

      //Logging directory to store logs (Only used in non-Docker production)	
      logs: './logs/'
    },

    //TLS/Websocket server options
    server: {
      //Allowed CORS domains/addresses
      cors: [
        'https://127.0.0.1:8443'
      ],

      //Listening port
      port: 443,

      //Session expire time (How long a login is good for) (Milliseconds)	
      sessionExpire: 1000 * 60 * 30,

      //Rate limit window (Milliseconds)	
      rateLimitWindow: 1000 * 60 * 15,

      //Maximum requests per rate limit window (0 to disable)
      rateLimitRequests: 0,

      //Max upload size	(How big are your files going to be)
      uploadLimit: '100mb'
    }
  },
  controller: {
    //How long to wait after pinging a controller before declaring it offline (Milliseconds)	
    timeout: 1000 * 3,

    //[ADVANCED USERS ONLY] Controller symmetric key length	(Used to authenticate controllers with the core) (Bytes)
    keyLength: 512
  }
}; 
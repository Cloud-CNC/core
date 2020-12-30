/**
 * @fileoverview Cloud CNC Core Server
 */

//Imports
const config = require('config');
const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const https = require('https');
const logger = require('./app/lib/logger.js');
const mongo = require('./app/lib/mongo.js').connect();
const redis = require('./app/lib/redis.js').connect();
const socket = require('./app/socket/server.js');

//Ensure storage directory exists
const storagePath = config.get('core.data.filesystem');
if (!fs.existsSync(storagePath))
{
  logger.warn(`Storage directory (${storagePath}) does not exist, creating it!`);
  fs.mkdirSync(storagePath);
}

//Ensure JWT secret exists
const secretPath = config.get('core.cryptography.secret');
if (!fs.existsSync(secretPath))
{
  logger.warn(`JWT secret at ${secretPath} does not exist, creating it!`);

  //Generate secret
  const secret = crypto.randomBytes(512).toString('base64');

  //Save
  fs.writeFileSync(secretPath, secret);
}

//Ensure certificates exist
const certPath = config.get('core.cryptography.cert');
const keyPath = config.get('core.cryptography.key');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath))
{
  logger.error(`TLS certificate at ${certPath} or key at ${keyPath} does not exist!
To create one with Open SSL (For development/testing purposes only!), run:
openssl req -x509 -newkey rsa:4096 -addext "subjectAltName = DNS:localhost, IP:127.0.0.1" -nodes -sha256 -days 365 -keyout ${keyPath} -out ${certPath}`);
  process.exit(1);
}

//Get port number
const port = config.get('core.server.port');

//Express
const app = express();
const server = https.createServer({
  cert: fs.readFileSync(certPath, 'utf8'),
  key: fs.readFileSync(keyPath, 'utf8')
}, app).listen(port);

//Socket
const socketServer = socket.connect(server);

//Secondary imports (After databases are initialized)
const middleware = require('./app/middleware/index.js');
const routes = require('./app/routes/index.js');

//Middleware
app.use(middleware);

//Prevent leaking server information
app.disable('x-powered-by');

//Routes
app.use(routes);

//Shutdown
const shutdown = async () =>
{
  logger.warn('Application shuting down!');

  //Close servers
  await new Promise((_, reject) => socketServer.close(reject));
  await new Promise((_, reject) => server.close(reject));

  //Close database connections
  await new Promise((_, reject) => mongo.connection.close(reject));
  await new Promise((_, reject) => redis.quit(reject));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

logger.info(`Started Cloud CNC Core, listening at :${port}`);

//Export
module.exports = server;
/**
 * @fileoverview Cloud CNC Core Server
 */

//Imports
const config = require('config');
const express = require('express');
const fs = require('fs');
const https = require('https');
const logger = require('./app/lib/logger.js');
const mongo = require('./app/lib/mongo.js').connect();
const redis = require('./app/lib/redis.js').connect();
const socket = require('./app/socket/server.js');

//Get port number
const port = config.get('core.server.port');

//Express
const app = express();
const server = https.createServer({
  cert: fs.readFileSync(config.get('core.cryptography.cert'), 'utf8'),
  key: fs.readFileSync(config.get('core.cryptography.key'), 'utf8')
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

//Ensure directory for storing uploaded files exists
const storageDirectory = config.get('core.data.filesystem');
if (!fs.existsSync(storageDirectory))
{
  logger.error(`Filesystem storage directory (${storageDirectory}) does not exist, please create it!`);
  process.exit(1);
}

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
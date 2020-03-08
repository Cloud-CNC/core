/**
 * @fileoverview Cloud CNC Core Server
 */

//Imports
const config = require('./config.js');
const express = require('express');
const fs = require('fs');
const https = require('https');
const middleware = require('./app/middleware/index.js');
const routes = require('./app/routes/index.js');
const websocket = require('./app/websocket/index.js');
const ws = require('ws');
let mongo = require('./app/lib/mongo.js');

//Bootstrap mongo client
mongo().then(mongoose =>
{
  mongo = mongoose;
});

//Express
const app = express();
const server = https.createServer({
  cert: fs.readFileSync(config.core.cert, 'utf8'),
  key: fs.readFileSync(config.core.key, 'utf8')
}, app).listen(config.core.port);

//Websocket
const wss = new ws.Server({
  server: server,
  verifyClient: websocket.authenticate
}).on('connection', websocket.connection);

//Middleware
app.use(middleware);

//Prevent leaking server information
app.disable('x-powered-by');

//Routes
app.use(routes);

//Shutdown
const shutdown = async () =>
{
  //Close servers
  wss.close();
  server.close();

  //Close Mongo
  mongo.disconnect();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

//Export
module.exports = server;
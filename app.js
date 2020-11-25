/**
 * @fileoverview Cloud CNC Core Server
 */

//Imports
const config = require('config');
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const middleware = require('./app/middleware/index.js');
const routes = require('./app/routes/index.js');
const websocket = require('./app/websocket/index.js');
const ws = require('ws');

//Bootstrap mongo client
let mongo = require('./app/lib/mongo.js');
mongo().then(mongoose =>
{
  mongo = mongoose;
});

//Express
const app = express();
let server;

if (config.get('core.cryptography.tls'))
{
  server = https.createServer({
    cert: fs.readFileSync(config.get('core.cryptography.cert'), 'utf8'),
    key: fs.readFileSync(config.get('core.cryptography.key'), 'utf8')
  }, app);
}
else
{
  server = http.createServer(app);
}

server.listen(config.get('core.server.port'));

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
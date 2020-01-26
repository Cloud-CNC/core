/**
 * @fileoverview Cloud CNC Core Server
 */

//Imports
const config = require('./config.js');
const express = require('express');
const fs = require('fs');
const https = require('https');
const middleware = require('./app/middleware/index.js');
const mongo = require('./app/lib/mongo.js');
const routes = require('./app/routes/index.js');
const websocket = require('./app/websocket/index.js');
const ws = require('ws');

//Bootstrap mongo client
mongo();

//Express
const app = express();
const server = https.createServer({
  cert: fs.readFileSync(config.core.cert, 'utf8'),
  key: fs.readFileSync(config.core.key, 'utf8')
}, app).listen(config.core.port);

//Websocket
new ws.Server({
  server: server,
  verifyClient: websocket.authenticate
}).on('connection', websocket.connection);

//Middleware
app.use(middleware);

//Prevent leaking server information
app.disable('x-powered-by');

//Routes
app.use(routes);

//Export
module.exports = server;
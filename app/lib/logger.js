/**
 * @fileoverview Smart logger
 */

//Imports
const config = require('../../config.js');
const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger();

//Production: log to file
if (process.env.NODE_ENV == 'production')
{
  logger.format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json());
  logger.add(new (winston.transports.DailyRotateFile)({datePattern: 'HH-MM-DD-YYYY', filename: config.core.logs + '%DATE%.txt', maxSize: '1g'}));
}
//Testing: don't log
else if (process.env.NODE_ENV == 'testing')
{
  logger.add(new winston.transports.Console());
  logger.transports.forEach(transport =>
  {
    transport.silent = true;
  });
}
//Development or docker: log to console
else
{
  logger.format = winston.format.combine(
    winston.format.colorize(),
    winston.format.cli());
  logger.add(new winston.transports.Console());
}

//Export
module.exports = logger;
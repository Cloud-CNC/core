/**
 * @fileoverview Smart logger
 */

//Imports
const config = require('config');
const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger();

//Switch between different logging targets
switch (config.get('core.logger.mode'))
{
  //Log to console
  case 'console': {
    logger.format = winston.format.combine(
      winston.format.colorize(),
      winston.format.cli());

    logger.add(new winston.transports.Console());
    break;
  }

  //Log to file
  case 'file':
  default: {
    logger.format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json());

    logger.add(new winston.transports.DailyRotateFile({
      datePattern: 'HH-MM-DD-YYYY',
      filename: config.get('core.logger.directory') + '%DATE%.txt',
      maxSize: '100m'
    }));
    break;
  }

  //Don't log
  case 'silent': {
    logger.add(new winston.transports.Console());

    logger.transports.forEach(transport =>
    {
      transport.silent = true;
    });
    break;
  }
}

//Export
module.exports = logger;
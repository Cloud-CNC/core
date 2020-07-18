/**
 * @fileoverview Smart logger
 */

//Imports
const config = require('config');
const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger();

//Switch between different logging targets
switch (process.env.LOG)
{
  case 'file': {
    logger.format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json());

    logger.add(new winston.transports.DailyRotateFile({
      datePattern: 'HH-MM-DD-YYYY',
      filename: config.get('core.data.logs') + '%DATE%.txt',
      maxSize: '100m'
    }));
    break;
  }

  case 'silent': {
    logger.add(new winston.transports.Console());

    logger.transports.forEach(transport =>
    {
      transport.silent = true;
    });
    break;
  }

  default:
  case 'console': {
    logger.format = winston.format.combine(
      winston.format.colorize(),
      winston.format.cli());

    logger.add(new winston.transports.Console());
    break;
  }
}

//Export
module.exports = logger;
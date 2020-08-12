/* eslint-disable import/order */
/* eslint-disable babel/object-curly-spacing */
import fs from 'fs';
import path from 'path';
import { createLogger, transports, format } from 'winston';
import { logDirectory, environment } from '../config';
import DailyRotateFile from 'winston-daily-rotate-file';

let dir = logDirectory;
if (!dir) {
  dir = path.resolve('logs');
}

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

let logLevel;
if (environment === 'development') {
  logLevel = 'debug';
} else {
  logLevel = 'warn';
}

const options = {
  file: {
    level: logLevel,
    filename: `${dir} + ${Date.now()}+ '.log'`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: '20m',
    colorize: true,
    maxFiles: '14d',
  },
};

export default createLogger({
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint(),
      ),
    }),
  ],
  exceptionHandlers: [new DailyRotateFile(options.file)],
  exitOnError: false,
});

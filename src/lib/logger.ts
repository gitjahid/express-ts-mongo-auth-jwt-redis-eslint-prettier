import fs from 'fs';
import chalk from 'chalk';
import { format as dateFormat } from 'date-fns';
import { createLogger, transports, format } from 'winston';

const { combine, timestamp, printf } = format;
const LOG_DIRECTORY = `${__dirname}/../../logs`;

try {
  if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY);
  }
} catch (error) {
  console.error(error);
}

const logger = createLogger({
  transports: [
    new transports.File({
      level: 'info',
      filename: `${LOG_DIRECTORY}/${dateFormat(new Date(), 'dd-MM-yyyy')}-app.log`,
      format: combine(
        timestamp({
          format: 'DD-MM-YYYY HH:mm:ss',
        }),
        printf(i => `[${[i.timestamp]}] [${i.level.toUpperCase()}]: ${i.message}`),
      ),
    }),
    new transports.File({
      level: 'error',
      filename: `${LOG_DIRECTORY}/${dateFormat(new Date(), 'dd-MM-yyyy')}-error.log`,
      format: combine(
        timestamp({
          format: 'DD-MM-YYYY HH:mm:ss',
        }),
        printf(i => `[${[i.timestamp]}] [ERROR]: ${JSON.stringify(i)}`),
      ),
    }),
  ],
  exitOnError: false,
});

enum Levels {
  'error' = 'error',
  'warn' = 'warn',
  'info' = 'info',
  'http' = 'http',
  'verbose' = 'verbose',
  'debug' = 'debug',
  'silly' = 'silly',
}

const prefixes = {
  wait: `${chalk.cyan('wait')}  -`,
  error: `${chalk.red('error')} -`,
  warn: `${chalk.yellow('warn')}  -`,
  ready: `${chalk.green('ready')} -`,
  info: `${chalk.cyan('info')}  -`,
  event: `${chalk.magenta('event')} -`,
};

/**
 * Logger
 * @param message any
 */
function wait(message: any) {
  console.log(prefixes.wait, message);
  logger.log(Levels.info, message);
}

/**
 * Logger
 * @param message any
 */
function error(message: any) {
  console.error(prefixes.error, message);
  logger.error(message);
}

/**
 * Logger
 * @param message any
 */
function warn(message: any) {
  console.warn(prefixes.warn, message);
  logger.warn(message);
}

/**
 * Logger
 * @param message any
 */
function ready(message: any) {
  console.log(prefixes.ready, message);
  logger.log(Levels.info, message);
}

/**
 * Logger
 * @param message any
 */
function info(message: any) {
  console.info(prefixes.info, message);
  logger.log(Levels.info, message);
}

/**
 * Logger
 * @param message any
 */
function event(message: any) {
  console.log(prefixes.event, message);
  logger.log(Levels.info, message);
}

/**
 * Logger
 * @param message any
 */
function trace(message: any) {
  console.trace(prefixes.event, message);
  logger.log(Levels.info, message);
}

export default { wait, error, warn, ready, info, event, trace };

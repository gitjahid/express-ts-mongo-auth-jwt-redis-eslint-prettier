import mongoose, { MongooseOptions, Connection as MongoConnection } from 'mongoose';
import { DB_MONGOOSE_OPTIONS } from '@app/configs';
import logger from '@lib/logger';
import env from '@app/env';

/**
 * Establish mongodb connection with mongo server
 * @param options MongooseOptions
 * @returns Promise<MongoConnection>
 */
export default function database(options: MongooseOptions = DB_MONGOOSE_OPTIONS): Promise<MongoConnection> {
  return new Promise((resolve, reject) => {
    try {
      mongoose.connect(env.database.mongo, options);

      const { connection } = mongoose;

      connection.on('disconnected', () => logger.event('database has disconnected from the server'));

      connection.on('error', error => {
        reject(error);
      });

      connection.on('open', () => {
        resolve(connection);
      });

      connection.once('open', () => {
        logger.info('mongodb server is ready to use.');
      });
    } catch (error) {
      reject(error);
    }
  });
}

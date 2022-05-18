import { CorsOptions } from 'cors';
import { RedisOptions } from 'ioredis';
import { MongooseOptions } from 'mongoose';

// Database
export const DB_MONGOOSE_OPTIONS: MongooseOptions = {};

// Redis Options
export const REDIS_OPTIONS: RedisOptions = {
  enableReadyCheck: true,
  connectTimeout: 10000,
};

// Cors Origins
export const CORS_OPTIONS: CorsOptions = {
  origin: '*',
};

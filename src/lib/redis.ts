import Redis, { RedisOptions } from 'ioredis';
import { REDIS_OPTIONS } from '@app/configs';
import env from '@app/env';

/**
 * Establish redis connection with redis server
 * @param options RedisOptions
 * @returns Promise<Redis>
 */
export default function redis(options: RedisOptions = REDIS_OPTIONS): Promise<Redis> {
  return new Promise((resolve, reject) => {
    try {
      const redis = new Redis(env.database.redis, options);

      redis.on('connect', () => {
        resolve(redis);
      });

      redis.on('error', err => reject(err));
    } catch (error) {
      reject(error);
    }
  });
}

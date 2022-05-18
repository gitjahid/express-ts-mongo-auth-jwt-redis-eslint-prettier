import * as dotenv from 'dotenv';
import * as pkg from '../package.json';

// Load env variables
dotenv.config();

/**
 * Environment variable checker
 * @param key string
 * @returns string
 */
function getEnv(key: string): string {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
}

/**
 * Normalize server port
 * @param port string
 * @returns number | string
 */
function normalizePort(port: string): number | string {
  const parsedPort = parseInt(port, 10);

  if (Number.isNaN(parsedPort)) {
    return port;
  }

  if (parsedPort >= 0) {
    return parsedPort;
  }

  return 4000;
}

export default {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: getEnv('APP_NAME'),
    version: (pkg as any).version || '1.0.0',
    description: (pkg as any).description || '',
    host: getEnv('APP_HOST'),
    schema: getEnv('APP_SCHEMA'),
    routePrefix: getEnv('APP_ROUTE_PREFIX'),
    port: normalizePort(process.env.PORT || getEnv('APP_PORT')),
  },
  database: {
    dbTablePrefix: getEnv('DATABASE_TABLE_PREFIX'),
    mongo: getEnv('DATABASE_URL'),
    redis: getEnv('REDIS_URL'),
  },
  auth: {
    redisAuthTokensPrefix: getEnv('AUTH_REDIS_TOKENS_PREFIX'),
    jwtIssuer: getEnv('AUTH_JWT_ISSUER'),
    refreshTokenkey: getEnv('AUTH_REFRESH_TOKEN_KEY'),
    refreshTokenExpiry: getEnv('AUTH_REFRESH_TOKEN_EXPIRY'),
    accessTokenExpiry: getEnv('AUTH_ACCESS_TOKEN_EXPIRY'),
    accessTokenSecret: getEnv('AUTH_ACCESS_TOKEN_SECRET'),
    refreshTokenSecret: getEnv('AUTH_REFRESH_TOKEN_SECRET'),
  },
};

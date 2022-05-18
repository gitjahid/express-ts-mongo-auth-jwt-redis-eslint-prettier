import { sign, verify, JwtPayload, SignOptions } from 'jsonwebtoken';
import createError from 'http-errors';
import redis from '@lib/redis';
import logger from '@lib/logger';
import env from '@app/env';

/**
 * Sign a access token
 * @param userId string
 * @returns Promise<string>
 */
export function signAccessToken(userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const payload = {};

      const jwtOptions: SignOptions = {
        algorithm: 'HS256',
        expiresIn: env.auth.accessTokenExpiry,
        issuer: env.auth.jwtIssuer,
        audience: userId,
      };

      sign(payload, env.auth.accessTokenSecret as string, jwtOptions, async (err, token) => {
        if (err) {
          logger.error(err);
          reject(new createError.InternalServerError());
        }

        if (token === undefined) {
          logger.error('JWT: Failed to generate JWT token');
          reject(new createError.InternalServerError());
        } else {
          resolve(token);
        }
      });
    } catch (error) {
      logger.error(error);
      reject(new createError.InternalServerError());
    }
  });
}

/**
 * Sign a refresh token
 * @param userId string
 * @returns Promise<string>
 */
export function signRefreshToken(userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const payload = {};

      const jwtOptions: SignOptions = {
        algorithm: 'HS256',
        expiresIn: env.auth.refreshTokenExpiry,
        issuer: env.auth.jwtIssuer,
        audience: userId,
      };

      sign(payload, env.auth.refreshTokenSecret, jwtOptions, async (err, token) => {
        if (err) {
          logger.error(err);
          reject(new createError.InternalServerError());
        }

        if (token !== undefined) {
          const redisClient = await redis();

          redisClient.set(`${env.auth.redisAuthTokensPrefix}:${userId}`, token, err => {
            if (err) {
              logger.error(err);
              reject(new createError.InternalServerError());
              return;
            }

            resolve(token);
          });
        } else {
          logger.error('Failed to generate JWT token');
          reject(new createError.InternalServerError());
        }
      });
    } catch (error) {
      logger.error(error);
      reject(new createError.InternalServerError());
    }
  });
}

/**
 * Verify refresh token
 * @param refreshToken string
 * @returns Promise<string>
 */
export function verifyRefreshToken(refreshToken: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      verify(refreshToken, env.auth.refreshTokenSecret, async (err, payload) => {
        if (err) {
          reject(new createError.Unauthorized());
        }

        if (payload !== undefined) {
          const userId: any = (payload as JwtPayload).aud;

          const redisClient = await redis();

          redisClient.get(`${env.auth.redisAuthTokensPrefix}:${userId}`, (err, result) => {
            if (err) {
              logger.error(err);
              reject(new createError.InternalServerError());
            }

            if (refreshToken === result) {
              resolve(userId);
            }

            reject(new createError.Unauthorized());
          });
        } else {
          reject(new createError.Unauthorized());
        }
      });
    } catch (error) {
      logger.error(error);
      reject(new createError.InternalServerError());
    }
  });
}

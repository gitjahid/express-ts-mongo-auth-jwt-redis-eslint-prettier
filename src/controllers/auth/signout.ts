import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import redis from '@lib/redis';
import { verifyRefreshToken } from '@lib/jwt';
import logger from '@lib/logger';
import env from '@app/env';

/**
 * Signs out a user
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns -
 */
const signout = async (req: Request, res: Response, next: NextFunction) => {
  const { cookies } = req;

  if (!cookies?.[env.auth.refreshTokenkey]) {
    return next(new createError.Unauthorized());
  }

  try {
    const refreshToken = cookies[env.auth.refreshTokenkey];

    const redisClient = await redis();

    const userId = await verifyRefreshToken(refreshToken);

    redisClient.del(`${env.auth.redisAuthTokensPrefix}:${userId}`, err => {
      if (err) {
        logger.error(err);
      }
    });

    res.clearCookie(env.auth.refreshTokenkey, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: env.app.schema.toLocaleLowerCase() === 'https',
    });

    return res.sendStatus(204);
  } catch (error: any) {
    logger.error({
      message: error?.message,
      stack: error?.stack,
    });

    return next(new createError.InternalServerError());
  }
};

export default signout;

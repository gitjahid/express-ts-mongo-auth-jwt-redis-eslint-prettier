import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { signAccessToken, verifyRefreshToken, signRefreshToken } from '@lib/jwt';
import logger from '@lib/logger';
import env from '@app/env';

/**
 * Refresh current users refresh token
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns access token
 */
const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const { cookies } = req;

  if (!cookies?.[env.auth.refreshTokenkey]) {
    return next(new createError.Unauthorized());
  }

  try {
    const refreshToken = cookies[env.auth.refreshTokenkey];

    const userId = await verifyRefreshToken(refreshToken);

    const newAccessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);

    const tokenExpiresIn = Number(env.auth.refreshTokenExpiry) || 24 * 60 * 60 * 1000;

    res.cookie(env.auth.refreshTokenkey, newRefreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: env.app.schema.toLocaleLowerCase() === 'https',
      maxAge: tokenExpiresIn,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    logger.error({
      message: error?.message,
      stack: error?.stack,
    });

    return next(new createError.InternalServerError());
  }
};

export default refresh;

import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import User from '@models/users';
import { signAccessToken, signRefreshToken } from '@lib/jwt';
import logger from '@lib/logger';
import env from '@app/env';

/**
 * Signin a user
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns access token
 */
const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const userSchema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    const validUser = await userSchema.isValid(req.body);

    if (!validUser) {
      return next(new createError.Unauthorized('Invalid Credentials'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'You are not registered yet',
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return next(new createError.Unauthorized('Invalid Credentials'));
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    const tokenExpiresIn = Number(env.auth.refreshTokenExpiry) || 24 * 60 * 60 * 1000;

    res.cookie(env.auth.refreshTokenkey, refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: env.app.schema.toLocaleLowerCase() === 'https',
      maxAge: tokenExpiresIn,
    });

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error: any) {
    logger.error({
      message: error?.message,
      stack: error?.stack,
    });

    return next(new createError.InternalServerError());
  }
};

export default signin;

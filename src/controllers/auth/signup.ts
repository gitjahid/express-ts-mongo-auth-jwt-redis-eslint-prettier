import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import User from '@models/users';
import Blacklists from '@models/blacklists';
import { signAccessToken, signRefreshToken } from '@lib/jwt';
import logger from '@lib/logger';
import env from '@app/env';

/**
 * Create a user and set refresh token into redis
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns access token
 */
const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, password } = req.body;

    const userSchema = yup.object().shape({
      fullName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    const validUser = await userSchema.isValid(req.body);

    if (!validUser) {
      return next(new createError.BadRequest('Please fill all the fields carefully'));
    }

    const user = await User.findOne({
      $or: [{ email }],
    });

    if (user) {
      return next(new createError.Conflict('User already been registered'));
    }

    const blacklists = await Blacklists.findOne({
      $or: [{ email }],
    });

    if (blacklists) {
      return next(new createError.Forbidden("You'r email is blacklisted"));
    }

    const bcryptHashSalt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, bcryptHashSalt);

    const newUser = new User({ fullName, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);

    const tokenExpiresIn = Number(env.auth.refreshTokenExpiry) || 24 * 60 * 60 * 1000;

    res.cookie(env.auth.refreshTokenkey, refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: env.app.schema.toLocaleLowerCase() === 'https',
      maxAge: tokenExpiresIn,
    });

    return res.status(201).json({
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

export default signup;

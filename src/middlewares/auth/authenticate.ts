import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import createError from 'http-errors';
import User from '@models/users';
import env from '@app/env';

/**
 * Authenticate [middleware]
 * @param req Request
 * @param _res Response
 * @param next NextFunction
 * @returns void
 */
function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
      return next(new createError.Unauthorized());
    }

    const authToken = authHeader.toString().split(' ')[1];

    return jwt.verify(authToken, env.auth.accessTokenSecret, async (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError'
            ? 'Unauthorized'
            : err.message;
        return next(new createError.Unauthorized(message));
      }

      const jwtPayload = payload as JwtPayload;

      const user = await User.findById(jwtPayload.aud).select('-__v');

      if (!user) {
        return next(new createError.Unauthorized('Please make a new sign-in request'));
      }

      const data: any = user.toJSON();
      const userId = data._id;
      delete data._id;

      req.currentUser = {
        id: userId,
        ...data,
      };

      return next();
    });
  } catch (error) {
    return next(new createError.InternalServerError());
  }
}

export default authenticate;

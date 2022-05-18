import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import logger from '@lib/logger';

/**
 * Fetch current authenticated user
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns current session user
 */
const session = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentUser } = req;

    if (!currentUser) {
      return next(new createError.Unauthorized());
    }

    return res.status(200).json({
      success: true,
      response: currentUser,
    });
  } catch (error: any) {
    logger.error({
      message: error?.message,
      stack: error?.stack,
    });

    return next(new createError.InternalServerError());
  }
};

export default session;

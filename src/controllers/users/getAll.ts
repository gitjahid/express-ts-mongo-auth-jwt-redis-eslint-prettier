import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import User from '@models/users';
import logger from '@lib/logger';

/**
 * Fetch all users from database
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns Users with pagination
 */
const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, size }: any = req.query;
    const currentPage = !page ? 1 : parseInt(page, 10);
    const limit = !size ? 8 : parseInt(size, 10);

    const offset = (currentPage - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find().limit(limit).skip(offset);

    const formatedUsers = users.map(user => {
      const data: any = user.toJSON();
      const userId = data._id;

      delete data._id;
      delete data.__v;

      return {
        id: userId,
        ...data,
      };
    });

    return res.status(200).json({
      success: true,
      response: {
        users: formatedUsers,
        pagination: {
          totalItems: totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          perPageItems: limit,
          currentPage,
        },
      },
    });
  } catch (error: any) {
    logger.error({
      message: error.message,
      stack: error.stack,
    });

    return next(new createError.InternalServerError());
  }
};

export default getAll;

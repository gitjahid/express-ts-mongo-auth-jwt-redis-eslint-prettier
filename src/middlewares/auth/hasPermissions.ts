import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

/**
 * Checks user permissions [middleware]
 * @param permissions string[]
 * @returns void
 */
function hasPermissions(permissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const currentUserPermissions = req.currentUser.permissions;

    if (!currentUserPermissions) {
      return next(new createError.Forbidden());
    }

    const permissionsArray = [...permissions];

    const userPerms = currentUserPermissions
      .map((perms: string) => permissionsArray.includes(perms))
      .find((value: boolean) => value === true);

    if (!userPerms) {
      return next(new createError.Forbidden());
    }

    return next();
  };
}

export default hasPermissions;

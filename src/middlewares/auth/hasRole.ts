import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

/**
 * Checks user role [middleware]
 * @param allowedRoles string[]
 * @returns void
 */
function checkUserRole(allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const currentUserRole = req.currentUser.role;

    if (!currentUserRole) {
      return next(new createError.Forbidden());
    }

    const rolesArray = [...allowedRoles.map(role => role.toLocaleLowerCase())];

    const userRole = rolesArray.includes(currentUserRole);

    if (!userRole) {
      return next(new createError.Forbidden());
    }

    return next();
  };
}

export default checkUserRole;

/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';

import { userRoles } from '../constants.js';

export const requiredAdminRoles = (req: Request, res: Response, next: NextFunction) => {
  const roles = req.session.user?.roles;

  const isAdmin = roles.includes(userRoles.is_admin);

  if (isAdmin) {
    next(); // User is authenticated, continue to next middleware
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Only admins can access this route!',
    });
  }
};

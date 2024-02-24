import { NextFunction, Request, Response } from 'express';

import { requiredAdminRoles } from './checkUserRoles.js';
import { requireAuth } from './requiredAuth.js';

export // Middleware conditionnel pour appliquer requireAuth et requiredAdminRoles uniquement aux routes autres que GET
const NotauthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  //   const method = req.method;
  //   const part = req.originalUrl.split("/");
  //   const endpoint = part[part.length - 1];

  //   console.log("end : ", method, endpoint, req.originalUrl);

  //   if (method === "GET") {
  //   } else {
  //     requiredAdminRoles(req, res, next);
  //     requireAuth(req, res, next);
  //   }
  next();
};

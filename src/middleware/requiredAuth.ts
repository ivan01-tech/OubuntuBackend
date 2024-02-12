import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line consistent-return
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId || req.session.user) {
    next(); // User is authenticated, continue to next middleware
  } else {
    console.log('session : ', req.session, req.sessionID);
    return res.status(403).json({ status: 'error', menubar: 'UnAuthenticated' });
  }
};

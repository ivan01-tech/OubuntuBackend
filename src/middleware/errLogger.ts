import { NextFunction, Request, Response } from 'express';

import { logEvent } from './logger.js';

const errLogger = async function (err: Error, req: Request, res: Response, _next: NextFunction) {
  await logEvent(`${req.method}\t${req.path}\t${req.headers.origin}\t${err.message}`, 'errLog.log');
  console.log(err.stack);
  _next();
};

export default errLogger;

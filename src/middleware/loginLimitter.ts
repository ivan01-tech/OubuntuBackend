import rateLimit from 'express-rate-limit';

import { logEvent } from './logger.js';

/**
 this handler aims to limit the number of trying to authenticate in the auth route
 */
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: 'Too many accounts created from this IP, please try again after a minute',
  async handler(req, res, next, options) {
    logEvent(`To many request ${options.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'error.log');
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default loginLimiter;

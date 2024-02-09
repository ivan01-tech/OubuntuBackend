import { NextFunction, Request, Response } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.userId) {
    next(); // User is authenticated, continue to next middleware
  } else {
    console.log("first middleware : " , req.session);
    return res
      .status(403)
      .json({ status: "error", message: "Authenticated ! please login" });
  }
};

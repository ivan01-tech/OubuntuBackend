// errorHandlerMiddleware.ts

import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MyCustomError } from "../utils/CustomError.js";

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle the error here
  console.error(err);
  if (err instanceof mongoose.Error) {
    // Handle different Mongoose error types gracefully
    if (
      err.name === "ValidationError" &&
      err instanceof mongoose.Error.ValidationError
    ) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    } else if (err.name === "CastError") {
      res.status(400).json({
        message: err.message,
        status: "error",
      });
    }
    //  else if (err instanceof mongoose.Error.ValidationError) {
    //   return res.status(400).json({ status: "error", errors: err.errors });
    // }
    else if (err instanceof MyCustomError) {
      return res.status(500).json({ status: "error", message: err.message });
    } else {
      return res
        .status(500)
        .json({ message: "Internal server error (Mongoose)" });
    }
  } else {
    console.log("error : ", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export default errorHandlerMiddleware;

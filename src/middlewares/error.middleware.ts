import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Check if the error is an instance of ApiError
  if (!(error instanceof ApiError)) {
    // If not, create a new ApiError (generic 500)
    // We try to grab the message and statusCode if they exist on the generic error
    const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
  }

  // Ensure we send a JSON response
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}), // Show stack only in dev
  };
  
  // ApiError class has a `data` field which is usually null for errors, and success=false
  // but we want to ensure the structure matches what frontend expects.
  // The ApiError class sets this.success = false in constructor.
  
  return res.status(error.statuscode || 500).json({
      success: false,
      message: error.message,
      errors: error.errors,
      data: error.data,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
  });
};

export { errorHandler };


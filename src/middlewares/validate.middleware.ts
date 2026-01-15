import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema: ZodSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
        if (error instanceof ZodError) {
             const errorMessage = error.issues.map((err: any) => err.message).join(", ");
             return next(new ApiError(400, errorMessage));
        }
      return next(error);
    }
  };

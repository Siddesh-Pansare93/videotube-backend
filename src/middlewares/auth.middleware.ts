import { Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.model.js";
import { AuthenticatedRequest, AccessTokenPayload } from "../types/index.js";

export const verifyJWT = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      // console.log("token is  ",token)
      if (!token) {
        throw new ApiError(401, "Unauthorized Request");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as AccessTokenPayload;
      // console.log("decodedToken is " , decodedToken);

      if (!decodedToken) {
        throw new ApiError(401, "Unauthorized Request");
      }

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );
      // console.log(user);

      if (!user) {
        throw new ApiError(401, "Invalid Access Tokens");
      }

      req.user = user;
      next();
    } catch (error) {
      const err = error as Error;
      return res.status(401).json({
        statusCode: 401,
        data: null,
        message: err?.message || "Invalid Access Token",
        success: false,
      });
    }
  }
);

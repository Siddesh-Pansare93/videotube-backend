// import  verify  from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    // console.log("token is  ",token)
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
    return res.status(401).json({
      statusCode: 401,
      data: null,
      message: error?.message || "Invalid Access Token",
      success: false,
    });
  }
});

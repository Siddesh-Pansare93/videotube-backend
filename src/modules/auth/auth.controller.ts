import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  changePasswordService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  registerUserService,
} from "./auth.service.js";
import { AuthenticatedRequest, MulterFiles } from "../../types/index.js";
import { ApiError } from "../../utils/ApiError.js";

const registerUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const files = req.files as MulterFiles | undefined;
  
  const user = await registerUserService(req.body, files);

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User created Successfully"));
});

const loginUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { loggedInUser, accessToken, refreshToken } = await loginUserService(req.body);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
  }
  
  await logoutUserService(req.user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  const { accessToken, newRefreshToken } = await refreshAccessTokenService(
    incomingRefreshToken
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Access Token refreshed Successfully"
      )
    );
});

const changeCurrentPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
  }

  await changePasswordService(req.user._id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
};

import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  getChannelUserProfileService,
  getCurrentUserService,
  getUserWatchHistoryService,
  updateAccountDetailsService,
  updateAvatarService,
  updateCoverImageService,
} from "./user.service.js";
import { AuthenticatedRequest } from "../../types/index.js";

const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await getCurrentUserService(req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched Successfully"));
});

const updateAccountDetails = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized");
  
  const user = await updateAccountDetailsService(req.user._id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated succesfully"));
});

const updateAvatar = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  
  if (!req.user?._id) throw new ApiError(401, "Unauthorized");

  const user = await updateAvatarService(req.user._id, avatarLocalPath);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated Succesfully"));
});

const updateCoverImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image file is missing");
  }

  if (!req.user?._id) throw new ApiError(401, "Unauthorized");

  const user = await updateCoverImageService(req.user._id, coverImageLocalPath);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated Succesfully"));
});

const getChannelUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username required");
  }
  
  if (!req.user?._id) throw new ApiError(401, "Unauthorized");

  const usernameStr = Array.isArray(username) ? username[0] : username;

  const channel = await getChannelUserProfileService(req.user._id, usernameStr);

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel, "User channel fetched Successfully")
    );
});

const getUserWatchHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized");

  const watchHistory = await getUserWatchHistoryService(req.user._id);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        watchHistory,
        "User watch history fetched Successfully"
      )
    );
});

export {
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getChannelUserProfile,
  getUserWatchHistory,
};

import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthenticatedRequest } from "../../types/index.js";
import {
  getChannelStatsService,
  getChannelVideosService,
} from "./dashboard.service.js";
import { ApiError } from "../../utils/ApiError.js";

const getChannelStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const channelId = req.user._id as any;

    const channelStats = await getChannelStatsService(channelId);
    
    res
      .status(200)
      .json(
        new ApiResponse(200, channelStats, "Successfully fetched channel stats")
      );
});

const getChannelVideos = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const channelId = req.user._id as any;
    
    const channelVideos = await getChannelVideosService(channelId);
    
    res
      .status(200)
      .json(
        new ApiResponse(200, channelVideos, "Successfully found ChannelVideos")
      );
});

export { getChannelStats, getChannelVideos };

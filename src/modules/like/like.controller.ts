import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthenticatedRequest } from "../../types/index.js";
import {
  getLikedVideosService,
  toggleCommentLikeService,
  toggleTweetLikeService,
  toggleVideoLikeService,
} from "./like.service.js";
import { ApiError } from "../../utils/ApiError.js";

const toggleVideoLike = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { videoId } = req.params as { videoId: string };
    
    const result = await toggleVideoLikeService(videoId, req.user._id as any);
    
    res
        .status(200)
        .json(new ApiResponse(200, result.like || null, result.liked ? "Successfully Liked Video" : "Toggled video Like successfully"));
});

const toggleCommentLike = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { commentId } = req.params as { commentId: string };
    
    const result = await toggleCommentLikeService(commentId, req.user._id as any);
    
    res
        .status(200)
        .json(new ApiResponse(200, result.like || null, result.liked ? "Successfully Liked Comment" : "Toggle Comment Like Succesfully"));
});

const toggleTweetLike = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { tweetId } = req.params as { tweetId: string };
    
    const result = await toggleTweetLikeService(tweetId, req.user._id as any);
    
    res
        .status(200)
        .json(new ApiResponse(200, result.like || null, result.liked ? "Successfully Liked Tweet" : "Toggle Tweet Like Succesfully"));
});

const getLikedVideos = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    
    const likedVideos = await getLikedVideosService(req.user._id as any);
    
     res
      .status(200)
      .json(
        new ApiResponse(200, likedVideos, "SuccessFully fetched Liked Videos")
      );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };

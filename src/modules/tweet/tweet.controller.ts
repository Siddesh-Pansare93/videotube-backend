import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthenticatedRequest } from "../../types/index.js";
import {
  createTweetService,
  deleteTweetService,
  getUserTweetsService,
  updateTweetService,
} from "./tweet.service.js";
import { ApiError } from "../../utils/ApiError.js";

const createTweet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    
    const tweet = await createTweetService(req.body.content, req.user._id as any);
    
    res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    
    const userTweets = await getUserTweetsService(req.user._id as any);
    
    res
      .status(200)
      .json(new ApiResponse(200, userTweets, "User tweets found"));
});

const updateTweet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
     const { tweetId } = req.params as { tweetId: string };
     const updatedTweet = await updateTweetService(tweetId, req.body.content);
     
    res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
     const { tweetId } = req.params as { tweetId: string };
     const deletedTweet = await deleteTweetService(tweetId);
     
    res
      .status(200)
      .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

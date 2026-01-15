import { Response } from "express";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../types/index.js";

const createTweet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  //TODO: validating user before delete and update -------- Remaining

  try {
    const { content } = req.body;
    const owner = req.user?._id;

    if (!content || content.trim() == "") {
      throw new ApiError(400, "Please fill in all fields");
    }

    const tweet = await Tweet.create({
      content,
      owner,
    });

    if (!tweet) {
      throw new ApiError(400, "Failed to create Tweet");
    }

    res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet created successfully"));
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to create Tweet due to ${err.message}`
        )
      );
  }
});

const getUserTweets = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // TODO: get user tweets
  try {
    const userId = req.user?._id;

    const userTweets = await Tweet.find({
      owner: userId,
    });

    if (userTweets.length === 0) {
      throw new ApiError(404, "No tweets found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, userTweets, "User tweets found"));
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Error in finding User Tweets due to ${err.message}`
        )
      );
  }
});

const updateTweet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  //TODO: update tweet

  try {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() == "") {
      throw new ApiError(400, "Content is required");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedTweet) {
      throw new ApiError(404, "Failed to update tweet ");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to Update Tweet due to ${err.message}`
        )
      );
  }
});

const deleteTweet = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  //TODO: delete tweet

  try {
    const { tweetId } = req.params;

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
      throw new ApiError(404, "Failed to delete tweet ");
    }

    res
      .status(200)
      .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to delete Tweet due to ${err.message}`
        )
      );
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

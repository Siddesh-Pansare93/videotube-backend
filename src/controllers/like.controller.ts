import { Response } from "express";
import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../types/index.js";

const toggleVideoLike = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const owner = req.user?._id;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Video Does not exist");
    }

    const isLiked = await Like.findOne({
      video: videoId,
      likedBy: owner,
    });

    if (isLiked) {
      await Like.deleteOne({
        video: videoId,
        likedBy: owner,
      });

      res
        .status(200)
        .json(new ApiResponse(200, null, "Toggled video Like successfully"));
    } else {
      const LikedVideo = await Like.create({
        video: videoId,
        likedBy: owner,
      });

      if (!LikedVideo) {
        throw new ApiError(400, "Error occured while liking Video");
      }

      res
        .status(200)
        .json(new ApiResponse(200, LikedVideo, "Successfully Liked Video"));
    }
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to toggle Video Like due to ${err.message}`
        )
      );
  }
});

const toggleCommentLike = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const likedBy = req.user?._id;

    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Comment Does not exist");
    }

    const isLiked = await Like.findOne({
      likedBy,
      comment: commentId,
    });

    if (isLiked) {
      await Like.deleteOne({
        likedBy,
        comment: commentId,
      });

      res
        .status(200)
        .json(new ApiResponse(200, null, "Toggle Comment Like Succesfully"));
    } else {
      const likedComment = await Like.create({
        likedBy,
        comment: commentId,
      });

      if (!likedComment) {
        throw new ApiError(400, "Error occured while liking comment");
      }

      res
        .status(200)
        .json(new ApiResponse(200, likedComment, "Successfully Liked Comment"));
    }
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to toggle Comment Like due to ${err.message}`
        )
      );
  }
});

const toggleTweetLike = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { tweetId } = req.params;
    const likedBy = req.user?._id;

    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Comment Does not exist");
    }

    const isLiked = await Like.findOne({
      likedBy,
      tweet: tweetId,
    });

    if (isLiked) {
      await Like.deleteOne({
        likedBy,
        tweet: tweetId,
      });

      res
        .status(200)
        .json(new ApiResponse(200, null, "Toggle Comment Like Succesfully"));
    } else {
      const likedTweet = await Like.create({
        likedBy,
        tweet: tweetId,
      });

      if (!likedTweet) {
        throw new ApiError(400, "Error occured while liking Tweet");
      }

      res
        .status(200)
        .json(new ApiResponse(200, likedTweet, "Successfully Liked Comment"));
    }
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to toggle Tweet Like due to ${err.message}`
        )
      );
  }
});

const getLikedVideos = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const likedVideos = await Like.aggregate([
      {
        $match: {
          likedBy: userId,
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoDetails",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      _id: 0,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                ownerUsername: { $first: "$ownerDetails.username" },
              },
            },
            {
              $project: {
                owner: 0,
                ownerDetails: 0,
                __v: 0,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "likedBy",
          foreignField: "_id",
          as: "likedBy",
        },
      },
      {
        $project: {
          video: 0,
          __v: 0,
        },
      },
    ]);

    if (!likedVideos?.length) {
      throw new ApiError(404, "Not found any Liked Videos");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, likedVideos, "SuccessFully fetched Liked Videos")
      );
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to get liked Videos due to ${err.message}`
        )
      );
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };

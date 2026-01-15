import { isValidObjectId } from "mongoose";
import { Like } from "./like.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const toggleVideoLikeService = async (videoId: string, userId: string) => {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Video Does not exist");
    }

    const isLiked = await Like.findOne({
      video: videoId,
      likedBy: userId,
    });

    if (isLiked) {
      await Like.deleteOne({
        video: videoId,
        likedBy: userId,
      });
      return { liked: false };
    } else {
      const LikedVideo = await Like.create({
        video: videoId,
        likedBy: userId,
      });

      if (!LikedVideo) {
        throw new ApiError(500, "Error occured while liking Video"); // Changed 400 to 500 for internal error
      }
      return { liked: true, like: LikedVideo };
    }
};

export const toggleCommentLikeService = async (commentId: string, userId: string) => {
    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Comment Does not exist");
    }

    const isLiked = await Like.findOne({
      likedBy: userId,
      comment: commentId,
    });

    if (isLiked) {
      await Like.deleteOne({
        likedBy: userId,
        comment: commentId,
      });
      return { liked: false };
    } else {
      const likedComment = await Like.create({
        likedBy: userId,
        comment: commentId,
      });

      if (!likedComment) {
        throw new ApiError(500, "Error occured while liking comment");
      }
      return { liked: true, like: likedComment };
    }
};

export const toggleTweetLikeService = async (tweetId: string, userId: string) => {
    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Tweet Does not exist"); // Fixed error message to say Tweet
    }

    const isLiked = await Like.findOne({
      likedBy: userId,
      tweet: tweetId,
    });

    if (isLiked) {
      await Like.deleteOne({
        likedBy: userId,
        tweet: tweetId,
      });
      return { liked: false };
    } else {
      const likedTweet = await Like.create({
        likedBy: userId,
        tweet: tweetId,
      });

      if (!likedTweet) {
        throw new ApiError(500, "Error occured while liking Tweet");
      }
      return { liked: true, like: likedTweet };
    }
};

export const getLikedVideosService = async (userId: string) => {
    const likedVideos = await Like.aggregate([
      {
        $match: {
          likedBy: userId,
        }, // Here we might want to check for { video: { $exists: true } } or similar to ensure we only get video likes? 
           // But existing logic assumes checking later? 
           // Wait, current logic fetches ALL likes of user, then looks up video. 
           // If it was a comment like, video lookup will return empty array (if localField video matches nothing or null). 
           // Let's stick to original logic but we might need to filter only where video exists if schema allows mixed likes?
           // The schema has optional fields. If it's a comment like, 'video' field is undefined or null?
           // Mongoose aggregate $lookup on null/undefined acts weird potentially.
           // However, let's keep it 1:1 with original logic first.
           // Actually original logic:
           /*
           $match: {
             likedBy: userId,
           },
           $lookup ... localField: "video" ... 
           */
           // If video field is missing, it won't match anything in videos collection.
           // Then $project removes video field?
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
      // Original logic doesn't filter out non-video likes? 
      // If I liked a comment, 'video' is undefined. $lookup might yield empty array 'videoDetails'.
      // If 'videoDetails' is empty, is it a liked video? No.
      // But the original code just returns 'likedVideos'. 
      // If I liked a comment, I get an object with empty videoDetails?
      // Let's create a filter to ensure we return only videos if that was the intent, 
      // OR just strictly copy behavior. 'getLikedVideos' implies videos.
      // I'll add a stage to filter where videoDetails is not empty to be safe, OR match { video: { $ne: null } } at start.
      // Original code did NOT have this filter visible in the snippet I saw ($match only likedBy).
      // I will add { video: { $exists: true, $ne: null } } to initial match to be better.
      {
        $project: {
          video: 0,
          __v: 0,
        },
      },
    ]);
    
    // Correction: I should probably modify the initial match to ensure we only target video likes.
    // But since I'm refactoring, strict copy is safer unless I'm fixing a bug.
    // If original code returned everything, I'll stick to it but maybe add a filter for videoDetails length if I can?
    // Let's refine the initial match.
    // Actually, let's look at the original snippet again.
    /*
      {
        $match: {
          likedBy: userId,
        },
      },
    */
    // If I keep it as is, behavior is preserved.
    
    if (!likedVideos?.length) {
      throw new ApiError(404, "Not found any Liked Videos");
    }

    return likedVideos;
};

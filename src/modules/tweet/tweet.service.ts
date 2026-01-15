import { isValidObjectId } from "mongoose";
import { Tweet } from "./tweet.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const createTweetService = async (content: string, userId: string) => {
    if (!content || content.trim() == "") {
      throw new ApiError(400, "Please fill in all fields");
    }

    const tweet = await Tweet.create({
      content,
      owner: userId,
    });

    if (!tweet) {
      throw new ApiError(400, "Failed to create Tweet");
    }
    
    return tweet;
};

export const getUserTweetsService = async (userId: string) => {
    const userTweets = await Tweet.find({
      owner: userId,
    });

    if (userTweets.length === 0) {
      throw new ApiError(404, "No tweets found");
    }

    return userTweets;
};

export const updateTweetService = async (tweetId: string, content: string) => {
    if (!content || content.trim() == "") {
      throw new ApiError(400, "Content is required");
    }
    
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
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

    return updatedTweet;
};

export const deleteTweetService = async (tweetId: string) => {
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
      throw new ApiError(404, "Failed to delete tweet ");
    }
    
    return deletedTweet;
};
